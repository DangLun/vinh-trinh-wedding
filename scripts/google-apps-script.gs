/**
 * Google Apps Script nối trang cưới với Google Sheet, gồm ba tab:
 * - "Khách mời": danh sách khách bạn tự nhập, trang cưới đọc để dựng link mời riêng
 * - "Hồi âm": khách trả lời có đến không, mỗi khách một dòng (trả lời lại = cập nhật)
 * - "Lời chúc": lời chúc khách gửi, mỗi lần gửi một dòng
 * Cách cài: xem docs/google-sheets.md.
 *
 * Trang web chỉ gọi script này từ server, kèm khoá bí mật SHEET_SECRET đặt ở
 * Project Settings → Script properties. Không có khoá thì script từ chối.
 */

const GUESTS = {
  name: "Khách mời",
  headers: [
    "Mã",
    "Tên gọi",
    "Tự xưng",
    "Trang trọng",
    "Phía",
    "Lễ",
    "Đi cùng",
    "Lời nhắn",
  ],
};
const RSVP = {
  name: "Hồi âm",
  headers: ["Cập nhật lúc", "Mã", "Khách", "Phía", "Tham dự", "Lễ"],
};
const WISHES = {
  name: "Lời chúc",
  headers: ["Thời gian", "Tên", "Lời chúc", "Mã khách"],
};

/** Giải thích từng cột tab Khách mời: hiện ở ghi chú trên ô tiêu đề và trong tab Hướng dẫn */
const GUIDE = {
  Mã: "Tự điền khi bạn gõ Tên gọi, không sửa được. Mã nằm trong link mời riêng của khách: đổi mã thì link đã gửi không mở được nữa.",
  "Tên gọi":
    "Bắt buộc. Tên kèm danh xưng, đúng như muốn hiện trên thiệp. Vd: Anh Tuấn, Cô Ba, Bác Hai, Minh.",
  "Tự xưng":
    "Cô dâu chú rể xưng với khách này thế nào. Vd: tụi em, tụi con, tụi cháu, tụi mình.",
  "Trang trọng":
    'Tick cho người lớn: thiệp ghi "trân trọng kính mời". Bỏ trống: lời mời thân mật.',
  Phía: "Khách bên nào: Nhà trai, Nhà gái hoặc Bạn bè. Chọn trong ô.",
  Lễ: "Lễ mời khách đến dự. Chọn một lễ, hoặc Cả hai (bỏ trống cũng là cả hai).",
  "Đi cùng":
    'Người đi cùng, ghép sau tên trên thiệp: "người thương" thành "Anh Tuấn và người thương". Bỏ trống nếu mời một mình.',
  "Lời nhắn":
    "Không bắt buộc. Lời nhắn riêng hiện trong thiệp. Vd: Nhớ dẫn chị Hằng theo nha!",
};
const GUIDE_SHEET = "Hướng dẫn";
const CODE_PROTECTION = "Mã khách do trang cưới tự tạo";
// Cột từng có ở bản trước nay đã bỏ: script tự xoá khỏi tab Khách mời
const DROPPED_COLUMNS = ["Số người"];

const SIDES = ["Nhà trai", "Nhà gái", "Bạn bè"];
// Mã khách: 5 ký tự, bỏ các chữ dễ nhìn nhầm (l/1, o/0, i)
const CODE_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
const CODE_LENGTH = 5;

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "bad-json" });
  }
  const secret =
    PropertiesService.getScriptProperties().getProperty("SHEET_SECRET");
  if (!secret || body.secret !== secret) {
    return reply({ ok: false, error: "unauthorized" });
  }
  const actions = {
    "guests.list": listGuests,
    "rsvp.save": saveRsvp,
    "rsvp.list": listRsvps,
    "wish.add": addWish,
  };
  const run = actions[body.action];
  if (!run) return reply({ ok: false, error: "unknown-action" });
  return reply(run(body));
}

/** Menu "Trang cưới" trên thanh menu của sheet */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Trang cưới")
    .addItem("Tạo mã cho khách mới", "fillCodes")
    .addItem("Cài lại tab Khách mời", "resetGuestSheet")
    .addToUi();
}

/** Gõ (hoặc dán) tên khách mới vào tab Khách mời thì tự điền mã; sửa tay một ô mã thì trả lại */
function onEdit(e) {
  const s = e.range.getSheet();
  if (s.getName() !== GUESTS.name) return;
  const r = e.range;
  if (
    r.getRow() > 1 &&
    r.getColumn() === columns(s)["Mã"] &&
    r.getNumRows() === 1 &&
    r.getNumColumns() === 1
  ) {
    r.setValue(e.oldValue === undefined ? "" : e.oldValue);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Cột Mã do trang cưới tự tạo, không sửa tay được.",
      "Trang cưới",
    );
  }
  fillCodes();
}

// ---------- Khách mời ----------
// Cột được tìm theo tên tiêu đề ở dòng 1, không theo vị trí: chèn, xoá hay đổi chỗ cột
// vẫn đọc đúng. Thiếu cột nào thì script tự thêm vào cuối.

/** Trang cưới gửi kèm tên các lễ (`events`) để làm ô chọn cho cột "Lễ" */
function listGuests(body) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty("GUEST_EVENTS", JSON.stringify(body.events || []));
  const s = guestSheet();
  fillCodes();
  const col = columns(s);
  const n = s.getLastRow() - 1;
  if (n < 1) return { ok: true, rows: [] };
  const rows = [];
  s.getRange(2, 1, n, s.getLastColumn())
    .getValues()
    .forEach(function (r, i) {
      const get = function (h) {
        return r[col[h] - 1];
      };
      if (!str(get("Tên gọi"))) return;
      rows.push({
        row: i + 2,
        code: str(get("Mã")),
        name: str(get("Tên gọi")),
        self: str(get("Tự xưng")),
        formal: get("Trang trọng"),
        side: str(get("Phía")),
        events: str(get("Lễ")),
        plusOne: str(get("Đi cùng")),
        note: str(get("Lời nhắn")),
      });
    });
  return { ok: true, rows: rows };
}

/** Vị trí (tính từ 1) của từng cột theo tiêu đề; thiếu cột thì thêm vào cuối dòng tiêu đề */
function columns(s) {
  const head = headerRow(s);
  const col = {};
  GUESTS.headers.forEach(function (h) {
    let i = head.map(fold).indexOf(fold(h));
    if (i < 0) {
      head.push(h);
      i = head.length - 1;
      s.getRange(1, i + 1)
        .setValue(h)
        .setFontWeight("bold");
    } else if (head[i] !== h) {
      // Tiêu đề gõ tay khác mã chữ (vd "Ð" thay vì "Đ") thì viết lại cho chuẩn
      s.getRange(1, i + 1).setValue(h);
    }
    col[h] = i + 1;
  });
  return col;
}

function headerRow(s) {
  const width = Math.max(s.getLastColumn(), 1);
  return s.getRange(1, 1, 1, width).getValues()[0].map(str);
}

/**
 * So tiêu đề kiểu "nhìn giống là được": bỏ dấu, chữ thường, gộp khoảng trắng.
 * Chữ gõ trên các bàn phím khác nhau có thể trông y hệt mà khác mã ("Đ"/"Ð", "ù" liền
 * hoặc "u" + dấu huyền), so từng ký tự sẽ không nhận ra.
 */
function fold(v) {
  return str(v)
    .replace(/[đĐðÐ]/g, "d")
    .normalize("NFD")
    .split("")
    .filter(function (ch) {
      // Bỏ các dấu thanh, dấu mũ (ký tự ghép U+0300–U+036F sau khi tách NFD)
      const c = ch.charCodeAt(0);
      return c < 0x300 || c > 0x36f;
    })
    .join("")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Tab Khách mời: ô chọn, ghi chú giải thích, khoá cột Mã. Đặt lại mỗi khi danh sách lễ
 * hoặc vị trí cột đổi (đổi `v` khi sửa phần cài đặt này để sheet cũ được đặt lại).
 */
function guestSheet(force) {
  const s = sheet(GUESTS);
  tidyColumns(s);
  const props = PropertiesService.getScriptProperties();
  const events = JSON.parse(props.getProperty("GUEST_EVENTS") || "[]");
  const col = columns(s);
  const key = JSON.stringify({ v: 4, events: events, col: col });
  const old = props.getProperty("GUEST_SETUP");
  if (!force && old === key) return s;

  const rows = s.getMaxRows() - 1;
  const at = function (h) {
    return s.getRange(2, col[h], rows);
  };
  const list = function (values) {
    return SpreadsheetApp.newDataValidation()
      .requireValueInList(values, true)
      .setAllowInvalid(false)
      .build();
  };
  // Xoá ô chọn cũ (kể cả ô chọn lỡ nằm sai cột) rồi đặt lại đúng cột
  s.getRange(2, 1, rows, s.getMaxColumns()).clearDataValidations();
  at("Trang trọng").insertCheckboxes();
  at("Phía").setDataValidation(list(SIDES));
  if (events.length > 1) {
    at("Lễ").setDataValidation(list(["Cả hai"].concat(events)));
  }

  // Ghi chú giải thích trên ô tiêu đề (rê chuột hoặc chạm vào tiêu đề để xem)
  GUESTS.headers.forEach(function (h) {
    s.getRange(1, col[h]).setNote(GUIDE[h]);
  });

  // Cột Mã: tô xám, sửa thì Sheets hỏi lại trước (chủ file không khoá cứng được,
  // onEdit trả lại mã cũ nếu vẫn sửa). Cột Mã cũ nằm chỗ khác thì bỏ tô.
  const oldCode = old && JSON.parse(old).col && JSON.parse(old).col["Mã"];
  if (oldCode && oldCode !== col["Mã"]) {
    s.getRange(2, oldCode, rows).setBackground(null).setFontColor(null);
  }
  s.getRange(2, col["Mã"], rows)
    .setBackground("#eeeeee")
    .setFontColor("#666666");
  s.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) {
    if (p.getDescription() === CODE_PROTECTION) p.remove();
  });
  s.getRange(1, col["Mã"], s.getMaxRows())
    .protect()
    .setDescription(CODE_PROTECTION)
    .setWarningOnly(true);

  guideSheet();
  props.setProperty("GUEST_SETUP", key);
  return s;
}

/** Tab Hướng dẫn: bảng giải thích từng cột, viết lại mỗi lần cài đặt */
function guideSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const s = book.getSheetByName(GUIDE_SHEET) || book.insertSheet(GUIDE_SHEET);
  s.clear();
  const rows = [
    [
      "Tab Khách mời: mỗi khách (hoặc mỗi gia đình nhận chung một thiệp) một dòng.",
      "",
    ],
    ["Cột", "Điền gì"],
  ].concat(
    GUESTS.headers.map(function (h) {
      return [h, GUIDE[h]];
    }),
  );
  s.getRange(1, 1, rows.length, 2).setValues(rows).setVerticalAlignment("top");
  s.getRange(1, 1).setFontWeight("bold");
  s.getRange(2, 1, 1, 2).setFontWeight("bold");
  s.getRange(3, 1, GUESTS.headers.length, 1).setFontWeight("bold");
  s.getRange(3, 2, GUESTS.headers.length, 1).setWrap(true);
  s.setColumnWidth(1, 130);
  s.setColumnWidth(2, 560);
}

/**
 * Dọn cột: xoá cột đã bỏ (DROPPED_COLUMNS) và cột trùng tiêu đề còn trống (vd cột do bản
 * script trước thêm thừa). Cột trùng mà có dữ liệu thì giữ, không bao giờ xoá dữ liệu khách.
 * Xoá từ phải sang trái để vị trí các cột còn lại không lệch.
 */
function tidyColumns(s) {
  const head = headerRow(s).map(fold);
  const dropped = DROPPED_COLUMNS.map(fold);
  const n = Math.max(s.getLastRow() - 1, 1);
  const empty = function (i) {
    return s
      .getRange(2, i + 1, n)
      .getValues()
      .every(function (r) {
        return r[0] === "" || r[0] === false;
      });
  };
  const remove = [];
  head.forEach(function (h, i) {
    if (dropped.indexOf(h) >= 0) remove.push(i);
  });
  GUESTS.headers.map(fold).forEach(function (h) {
    const same = [];
    head.forEach(function (x, i) {
      if (x === h) same.push(i);
    });
    if (same.length < 2) return;
    // Giữ cột đầu tiên có dữ liệu (hoặc cột đầu tiên nếu cột nào cũng trống)
    const keep = same.filter(function (i) {
      return !empty(i);
    })[0];
    const kept = keep === undefined ? same[0] : keep;
    same.forEach(function (i) {
      if (i !== kept && empty(i)) remove.push(i);
    });
  });
  remove
    .sort(function (a, b) {
      return b - a;
    })
    .forEach(function (i) {
      s.deleteColumn(i + 1);
    });
}

/** Menu: cài lại ô chọn, ghi chú, khoá cột Mã (vd khi thấy ô chọn nằm sai cột) */
function resetGuestSheet() {
  guestSheet(true);
  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Đã cài lại ô chọn, ghi chú giải thích và khoá cột Mã.",
    "Trang cưới",
  );
}

/** Điền mã ngẫu nhiên, không trùng, cho các dòng đã có tên mà chưa có mã */
function fillCodes() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GUESTS.name);
  if (!s || s.getLastRow() < 2) return;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const col = columns(s);
    const values = s
      .getRange(2, 1, s.getLastRow() - 1, s.getLastColumn())
      .getValues();
    const code = function (r) {
      return str(r[col["Mã"] - 1]);
    };
    const used = {};
    values.forEach(function (r) {
      if (code(r)) used[code(r)] = true;
    });
    values.forEach(function (r, i) {
      if (code(r) || !str(r[col["Tên gọi"] - 1])) return;
      const fresh = newCode(used);
      used[fresh] = true;
      // Ghi từng ô để không đè lên ô khác bạn đang gõ cùng lúc
      s.getRange(i + 2, col["Mã"]).setValue(fresh);
    });
  } finally {
    lock.releaseLock();
  }
}

function newCode(used) {
  for (;;) {
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
    }
    if (!used[code]) return code;
  }
}

// ---------- Hồi âm ----------

function saveRsvp(body) {
  const a = body.answer;
  // Hai khách bấm gửi cùng lúc thì lần lượt ghi, không đè nhau
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const s = rsvpSheet();
    const row = [
      new Date(),
      text(a.code),
      text(a.name),
      text(a.side),
      a.attending ? "Có" : "Không",
      text(a.events.join(", ")),
    ];
    const codes = s
      .getRange(2, 2, Math.max(s.getLastRow() - 1, 1), 1)
      .getValues()
      .map(function (r) {
        return str(r[0]);
      });
    const i = codes.indexOf(a.code);
    if (i >= 0) {
      s.getRange(i + 2, 1, 1, row.length).setValues([row]);
    } else {
      s.appendRow(row);
    }
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/** Tab Hồi âm; bản trước có cột "Số người", nay bỏ: còn thì xoá đi để các cột khớp vị trí */
function rsvpSheet() {
  const s = sheet(RSVP);
  const head = headerRow(s).map(fold);
  for (let i = head.length - 1; i >= 0; i--) {
    if (head[i] === fold("Số người")) s.deleteColumn(i + 1);
  }
  return s;
}

function listRsvps() {
  const s = rsvpSheet();
  if (s.getLastRow() < 2) return { ok: true, rows: [] };
  const rows = s
    .getRange(2, 1, s.getLastRow() - 1, RSVP.headers.length)
    .getValues()
    .filter(function (r) {
      return str(r[1]);
    })
    .map(function (r) {
      return {
        updatedAt: r[0] instanceof Date ? r[0].toISOString() : str(r[0]),
        code: str(r[1]),
        attending: r[4] === "Có",
        events: str(r[5]),
      };
    });
  return { ok: true, rows: rows };
}

// ---------- Lời chúc ----------

function addWish(body) {
  const w = body.wish;
  sheet(WISHES).appendRow([
    new Date(),
    text(w.name),
    text(w.message),
    text(w.code),
  ]);
  return { ok: true };
}

// ---------- Dùng chung ----------

/** Lấy tab theo tên, chưa có thì tạo kèm dòng tiêu đề */
function sheet(def) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let s = book.getSheetByName(def.name);
  if (!s) {
    s = book.insertSheet(def.name);
    s.appendRow(def.headers);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, def.headers.length).setFontWeight("bold");
  }
  return s;
}

function str(v) {
  return v === null || v === undefined ? "" : String(v).trim();
}

/**
 * Chữ khách gõ, ghi vào ô: chữ bắt đầu bằng = + - @ sẽ bị Sheets hiểu là công thức,
 * nên thêm dấu ' phía trước để luôn là chữ thường (dấu ' không hiện trong ô).
 */
function text(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
