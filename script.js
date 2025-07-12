function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(div => div.style.display = 'none');
  document.getElementById(tab + 'Tab').style.display = 'block';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function insertSnippet(value, targetId) {
  const snippets = {
    // AMPscript
    "ampscript_var_set": '%%[\nVAR @name\nSET @name = "John Doe"\n]%%\nHello %%=v(@name)=%%',
    "ampscript_if_else": '%%[\nVAR @gender\nSET @gender = "M"\nIF @gender == "M" THEN\n  SET @title = "Mr."\nELSE\n  SET @title = "Ms."\nENDIF\n]%%\n%%=v(@title)=%%',
    "ampscript_lookup": '%%[\nSET @fname = Lookup("Contacts", "FirstName", "Email", emailaddr)\n]%%\nHello %%=v(@fname)=%%!',
    "ampscript_lookupRows": '%%[\nSET @rows = LookupRows("Orders", "CustomerID", @id)\nSET @count = RowCount(@rows)\n]%%\nTotal Orders: %%=v(@count)=%%',
    "ampscript_now_formatDate": '%%[\nSET @now = Now()\nSET @fmt = FormatDate(@now, "yyyy-MM-dd")\n]%%\nToday: %%=v(@fmt)=%%',
    "ampscript_empty_length": '%%[\nSET @text = ""\nIF Empty(@text) THEN\n  SET @msg = "Empty value"\nENDIF\n]%%\n%%=v(@msg)=%%',
    "ampscript_concat_upper": '%%[\nSET @name = "maheswara"\nSET @greeting = Concat("Hi ", Uppercase(@name))\n]%%\n%%=v(@greeting)=%%',

    // SSJS
    "ssjs_load_core": 'Platform.Load("Core", "1");',
    "ssjs_write": 'Write("Hello from SSJS");',
    "ssjs_try_catch": 'try {\n  Write("Trying code...");\n} catch(e) {\n  Write("Error: " + Stringify(e));\n}',
    "ssjs_lookup": 'Platform.Load("Core", "1");\nvar result = Lookup("Contacts", "FirstName", "Email", "test@example.com");\nWrite(result);',
    "ssjs_lookupRows": 'Platform.Load("Core", "1");\nvar rows = LookupRows("Subscribers", "Status", "Active");\nWrite("Rows: " + rows.length);',
    "ssjs_de_init": 'Platform.Load("Core", "1");\nvar de = DataExtension.Init("Orders");\nvar row = de.Rows.Lookup("OrderID", "12345");\nWrite(row);',
    "ssjs_json": 'var json = \'{"name":"Mahesh"}\';\nvar parsed = Platform.Function.ParseJSON(json);\nWrite(parsed.name);',

    // SQL
    "sql_select_top": 'SELECT TOP 10 * FROM Contact_DE;',
    "sql_join": 'SELECT c.Email, o.OrderID\nFROM Contacts c\nJOIN Orders o ON c.ContactID = o.ContactID;',
    "sql_case_when": 'SELECT FirstName,\nCASE WHEN Gender = \'M\' THEN \'Mr.\' ELSE \'Ms.\' END AS Salutation\nFROM Contacts;',
    "sql_datepart": 'SELECT Email, DATEPART(month, CreatedDate) AS SignupMonth FROM Subscribers;',
    "sql_coalesce": 'SELECT Email, COALESCE(FirstName, "Customer") AS Name FROM Contacts;',
    "sql_isnull": 'SELECT ISNULL(Phone, "Not Provided") AS Phone FROM Contacts;',
    "sql_cast_convert": 'SELECT CAST(CreatedDate AS DATE) AS SignupDate FROM Subscribers;',
    "sql_where_like": 'SELECT * FROM Contacts WHERE Email LIKE \'%@gmail.com\';'
  };

  if (snippets[value]) {
    document.getElementById(targetId).value = snippets[value];
  }
}

function run(type) {
  const code = document.getElementById(type + "Code").value.trim();
  let output = "";
  let log = "";

  try {
    if (!code) throw new Error("❗ Code is empty.");

    switch (type) {
      case "ampscript":
        if (!code.includes("%%")) throw new Error("❌ AMPscript must include %% syntax.");
        output = "// AMPscript interpreted output (simulated)\n" + code;
        log = "✅ AMPscript looks valid.";
        break;

      case "ssjs":
        if (!code.includes("Write(")) log += "⚠️ No Write() statement detected.\n";
        if (!code.includes("Platform.Load")) log += "⚠️ Missing Platform.Load for Core.\n";
        output = "// SSJS interpreted output (simulated)\n" + code;
        log += "✅ SSJS looks syntactically fine.";
        break;

      case "sql":
        if (!/select/i.test(code)) throw new Error("❌ SQL must contain SELECT.");
        if (!/from/i.test(code)) log += "⚠️ Missing FROM clause.\n";
        output = "-- Simulated SQL Output:\n" + code;
        log += "✅ SQL syntax appears valid.";
        break;

      case "json":
        const parsed = JSON.parse(code);
        output = JSON.stringify(parsed, null, 2);
        log = "✅ Valid JSON";
        break;

      default:
        throw new Error("Unsupported type: " + type);
    }

  } catch (e) {
    output = "// 🔴 Error Output\n";
    log = e.message || "❌ Unknown Error";
  }

  document.getElementById(type + "Out").innerText = output;
  document.getElementById(type + "Log").innerText = log;
}
