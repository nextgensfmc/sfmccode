const snippetMap = {
  ampscript: {
    personalization: `%%[\nVAR @firstName\nSET @firstName = "Mahesh"\n]%%\nHello %%=v(@firstName)=%%, welcome to Next-Gen SFMC!`,
    ifElse: `%%[\nVAR @country\nSET @country = "India"\nIF @country == "India" THEN\n  SET @message = "Namaste 🇮🇳"\nELSE\n  SET @message = "Hello 👋"\nENDIF\n]%%\n%%=v(@message)=%%`,
    dateFormat: `%%[\nSET @today = NOW()\nSET @formattedDate = FORMAT(@today, "dd MMMM yyyy")\n]%%\nToday's date is: %%=v(@formattedDate)=%%`,
    loop: `%%[\nFOR @i = 1 TO 5 DO\n]%%\nIteration %%=v(@i)=%%<br>\n%%[\nNEXT @i\n]%%`,
    emailAttr: `%%[\nVAR @email\nSET @email = AttributeValue("emailaddr")\n]%%\nYour email: %%=v(@email)=%%`,
    lookup: `%%[\nVAR @firstName\nSET @firstName = Lookup("Customer_DE", "FirstName", "Email", emailaddr)\n]%%\nHi %%=v(@firstName)=%%, thanks for subscribing!`,
    uppercase: `%%[\nSET @name = "Mahesh"\nSET @upperName = UPPERCASE(@name)\n]%%\nUppercase: %%=v(@upperName)=%%`,
    concat: `%%[\nVAR @full\nSET @full = CONCAT("Next", "Gen")\n]%%\nResult: %%=v(@full)=%%`
  },
  ssjs: {
    log: `<script runat="server">\nPlatform.Response.Write("Hello from SSJS!");\n</script>`,
    variable: `<script runat="server">\nvar name = "Mahesh";\nPlatform.Response.Write("Hi, " + name);\n</script>`,
    lookup: `<script runat="server">\nvar email = Attribute.GetValue("emailaddr");\nvar name = Lookup("Customer_DE", "FirstName", "Email", email);\nPlatform.Response.Write("Welcome " + name);\n</script>`
  },
  sql: {
    basic: `SELECT FirstName, Email FROM Customer_DE WHERE Subscribed = 1`,
    count: `SELECT COUNT(*) as Total FROM Orders WHERE OrderDate > GETDATE() - 30`,
    join: `SELECT c.FirstName, o.OrderDate\nFROM Customer_DE c\nJOIN Orders o ON c.Email = o.Email`
  },
  json: {
    example: `{
  "name": "Mahesh",
  "country": "India",
  "subscribed": true
}`,
    nested: `{
  "user": {
    "name": "Mahesh",
    "location": {
      "city": "Mumbai",
      "country": "India"
    }
  }
}`
  },
  api: {
    rest: `GET https://YOUR_SUBDOMAIN.rest.marketingcloudapis.com/data/v1/customobjectdata/key/Customer_DE/rowset`,
    post: `POST https://YOUR_SUBDOMAIN.rest.marketingcloudapis.com/messaging/v1/messageDefinitionSends/key:WelcomeEmail/send\n{
  "To": {
    "Address": "test@example.com",
    "SubscriberKey": "test@example.com",
    "ContactAttributes": {
      "SubscriberAttributes": {
        "FirstName": "Mahesh"
      }
    }
  }
}`,
    soap: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">\n  <soapenv:Body>\n    <RetrieveRequestMsg>\n      <RetrieveRequest>\n        <ObjectType>Email</ObjectType>\n        <Properties>ID</Properties>\n        <Properties>Name</Properties>\n      </RetrieveRequest>\n    </RetrieveRequestMsg>\n  </soapenv:Body>\n</soapenv:Envelope>`
  }
};

function loadCategorySnippets() {
  const category = document.getElementById("category").value;
  const snippetDropdown = document.getElementById("snippet");

  snippetDropdown.innerHTML = '<option value="">-- Choose a snippet --</option>';

  if (snippetMap.hasOwnProperty(category)) {
    for (const key in snippetMap[category]) {
    const option = document.createElement("option");
    option.value = key;
    option.text = key[0].toUpperCase() + key.slice(1);
          snippetDropdown.appendChild(option);
    }
  }
  }
}

function loadSnippet() {
  const category = document.getElementById("category").value;
  const snippetKey = document.getElementById("snippet").value;
  document.getElementById("code").value = snippetMap[category][snippetKey] || "";
}

function runCode() {
  const code = document.getElementById("code").value;
  const category = document.getElementById("category").value;
  let output = "";

  if (category === "ampscript") {
    output = simulateAMPscript(code);
  } else {
    output = "// Reference only — execution not supported for this code type.";
  }

  document.getElementById("output").innerText = output;
}

function simulateAMPscript(code) {
  let output = "";
  let errors = [];

  try {
    if (!code.includes("%%[")) throw new Error("Missing opening AMPscript tag (%%[)");
    if (!code.includes("]%%")) throw new Error("Missing closing AMPscript tag (]%%)");

    output = code.replace(/%%=v\((.*?)\)=%%/g, (match, p1) => {
      const varName = p1.trim();
      if (!varName.startsWith("@")) {
        errors.push(`Variable "${varName}" is not prefixed with '@'.`);
        return `ERROR(${varName})`;
      }
      return `Simulated(${varName})`;
    });

    if (errors.length > 0) output += "\n\n⚠️ Debug Logs:\n" + errors.join("\n");

  } catch (err) {
    output = "❌ AMPscript Error: " + err.message;
  }

  return output;
}

function copyToClipboard() {
  const code = document.getElementById("code");
  code.select();
  document.execCommand("copy");
  alert("Code copied to clipboard!");
}
