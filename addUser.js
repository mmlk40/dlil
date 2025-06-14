const { Octokit } = require("@octokit/rest");
const fs = require("fs");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = "YOUR_USERNAME";
const repo = "YOUR_REPO";
const path = "users.json";
const branch = "main";

// بيانات المستخدم الجديد
const newUser = {
  name: "محمد جديد",
  phone: "0550000000",
  region: "مكة",
  job: "مبرمج",
  status: "online",
  createdAt: Date.now()
};

async function addUser() {
  // جلب الملف الحالي
  const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
  const users = JSON.parse(Buffer.from(data.content, 'base64').toString());
  users.push(newUser);

  // تحديث الملف
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `إضافة مستخدم جديد: ${newUser.name}`,
    content: Buffer.from(JSON.stringify(users, null, 2)).toString('base64'),
    sha: data.sha,
    branch
  });

  console.log("تمت إضافة المستخدم بنجاح.");
}

addUser();