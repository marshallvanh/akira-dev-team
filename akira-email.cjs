const imaps = require("imap-simple")
const { simpleParser } = require("mailparser")

const config = {
  imap: {
    user: process.env.AKIRA_EMAIL,
    password: process.env.AKIRA_EMAIL_PASS,
    host: "outlook.office365.com",
    port: 993,
    tls: true,
    authTimeout: 10000
  }
}

async function checkInbox() {

  try {

    const connection = await imaps.connect(config)

    await connection.openBox("INBOX")

    const searchCriteria = ["UNSEEN"]

    const fetchOptions = {
      bodies: [""],
      markSeen: false
    }

    const results = await connection.search(searchCriteria, fetchOptions)

    const emails = []

    for (const item of results) {

      const all = item.parts.find(part => part.which === "")

      const parsed = await simpleParser(all.body)

      emails.push({
        from: parsed.from.text,
        subject: parsed.subject,
        text: parsed.text
      })

    }

    connection.end()

    return emails

  } catch (err) {

    console.log("Email error:", err)
    return []

  }

}

module.exports = {
  checkInbox
}
