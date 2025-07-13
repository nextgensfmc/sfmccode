
function runCode() {
  const code = document.getElementById("code").value;
  let output = "";
  let errors = [];

  try {
    if (!code.includes("%%[")) {
      throw new Error("Missing opening AMPscript tag (%%[)");
    }
    if (!code.includes("]%%")) {
      throw new Error("Missing closing AMPscript tag (]%%)");
    }

    // Simulate %%=v(@var)=%% output
    output = code.replace(/%%=v\((.*?)\)=%%/g, (match, p1) => {
      const varName = p1.trim();
      if (!varName.startsWith("@")) {
        errors.push(`Variable "${varName}" is not prefixed with '@'.`);
        return `ERROR(${varName})`;
      }
      return `Simulated(${varName})`;
    });

    if (errors.length > 0) {
      output += "\n\n⚠️ Debug Logs:\n" + errors.join("\n");
    }

  } catch (err) {
    output = "❌ AMPscript Error: " + err.message;
  }

  document.getElementById("output").innerText = output;
}

function loadSnippet() {
  const selected = document.getElementById("snippet").value;
  let snippet = "";

  switch (selected) {
    case "personalization":
      snippet = `%%[\nVAR @firstName\nSET @firstName = "Mahesh"\n]%%\nHello %%=v(@firstName)=%%, welcome to Next-Gen SFMC!`;
      break;
    case "ifElse":
      snippet = `%%[\nVAR @country\nSET @country = "India"\nIF @country == "India" THEN\n  SET @message = "Namaste 🇮🇳"\nELSE\n  SET @message = "Hello 👋"\nENDIF\n]%%\n%%=v(@message)=%%`;
      break;
    case "dateFormat":
      snippet = `%%[\nSET @today = NOW()\nSET @formattedDate = FORMAT(@today, "dd MMMM yyyy")\n]%%\nToday's date is: %%=v(@formattedDate)=%%`;
      break;
    case "loop":
      snippet = `%%[\nFOR @i = 1 TO 5 DO\n]%%\nIteration %%=v(@i)=%%<br>\n%%[\nNEXT @i\n]%%`;
      break;
    case "emailAttr":
      snippet = `%%[\nVAR @email\nSET @email = AttributeValue("emailaddr")\n]%%\nYour email: %%=v(@email)=%%`;
      break;
    case "lookup":
      snippet = `%%[\nVAR @firstName\nSET @firstName = Lookup("Customer_DE", "FirstName", "Email", emailaddr)\n]%%\nHi %%=v(@firstName)=%%, thanks for subscribing!`;
      break;
    case "uppercase":
      snippet = `%%[\nSET @name = "Mahesh"\nSET @upperName = UPPERCASE(@name)\n]%%\nUppercase: %%=v(@upperName)=%%`;
      break;
    default:
      snippet = "";
  }

  if (snippet) {
    document.getElementById("code").value = snippet;
  }
}
