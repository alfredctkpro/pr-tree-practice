# Git + GitHub Pull Request 工作流程指南

## 為什麼要用 Pull Request？

### 過去的做法（直接 push main）
```
開發者 A → push main
開發者 B → push main
```
**問題：**
- 沒有人檢查彼此的程式碼，bug 容易上線
- 兩個人同時改到同一個檔案，容易互相覆蓋
- main 隨時可能是壞的，無法確保穩定

### 現在的做法（Pull Request 流程）
```
開發者 A → 開 branch → 寫 code → 建 PR → Review → 合併到 main
開發者 B → 開 branch → 寫 code → 建 PR → Review → 合併到 main
```
**解決了：**
- 每次改動都有人 Review，減少 bug
- 各自在自己的 branch 開發，互不干擾
- main 永遠是穩定、可部署的狀態

---

## 完整流程圖

```
本地端                              GitHub 遠端
──────                              ──────────
1. git checkout main
2. git pull origin main
3. git checkout -b feature/xxx
4. 寫程式
5. git add <files>
6. git commit -m "描述"
7. git push -u origin feature/xxx
                                    8.  建立 Pull Request
                                    9.  Code Review（留 comment）
                                    10. Reviewer Approve
                                    11. Squash and Merge
                                    12. Delete remote branch
13. git checkout main
14. git pull origin main
15. git branch -D feature/xxx
```

---

## 第一階段：本地開發

### 步驟 1：確保 main 是最新的
```bash
git checkout main
git pull origin main
```

| 指令 | 說明 |
|------|------|
| `git checkout main` | 切換到 main 分支（把 HEAD 指向 main） |
| `git pull origin main` | 從 GitHub 下載最新的 main 到本地（= fetch + merge） |

### 步驟 2：建立新的 feature branch
```bash
git checkout -b feature/xxx
```

| 參數 | 說明 |
|------|------|
| `checkout` | 切換分支 |
| `-b` | 建立新分支（branch 的縮寫）。不加 `-b` 的話，只能切到已存在的分支 |
| `feature/xxx` | 分支名稱，依照命名慣例（見下方） |

**分支命名慣例：**
- `feature/描述` — 新功能（例：`feature/add-login-page`）
- `fix/描述` — 修 bug（例：`fix/header-overlap`）
- `hotfix/描述` — 緊急修正
- `chore/描述` — 雜務（例：`chore/update-dependencies`）
- 全小寫，用 `-` 連接單字

### 步驟 3：開發 + Commit
```bash
git add index.html style.css
git commit -m "Add homepage with CSS styling"
```

| 指令 | 說明 |
|------|------|
| `git add <files>` | 把檔案的改動加入暫存區（包含新增、修改、刪除） |
| `git commit -m "..."` | 建立一個 commit，記錄這次的改動 |

> 可以多次 commit，最後 Squash and Merge 時會壓成一個。

### 步驟 4：推送到 GitHub
```bash
git push -u origin feature/xxx
```

| 參數 | 說明 |
|------|------|
| `-u` | upstream，設定追蹤關係。設定後之後只要打 `git push` 就好 |
| `origin` | 遠端倉庫（就是 GitHub） |
| `feature/xxx` | 要推送的分支名稱 |

> `-u` 只有第一次 push 新分支時需要加，之後不用。

---

## 第二階段：GitHub 遠端操作

### 步驟 5：建立 Pull Request

**方式 A：GitHub 網頁**
1. 打開 repo 頁面，點擊黃色橫幅的「Compare & pull request」
2. 填寫 Title 和 Description
3. Assignees：指派自己（負責開發的人）
4. Reviewers：指派同事（負責審查的人）
5. 點「Create pull request」

**方式 B：用 gh CLI**
```bash
gh pr create --title "Add homepage" --body "新增首頁"
```

### 步驟 6：Code Review

Reviewer 在 GitHub 網頁上操作：
1. 點「Files changed」查看程式碼差異
2. 在程式碼行左邊點 `+` 號留下 comment
3. 點「Start a review」累積多則 comment
4. 最後「Submit review」一次送出，選擇：

| 選項 | 意思 | 什麼時候用 |
|------|------|------------|
| **Comment** | 只是留意見，不影響合併 | 一般討論 |
| **Approve** | 審查通過 | 程式碼沒問題 |
| **Request changes** | 要求修改，擋住合併 | 有問題必須改 |

**Review 慣例：**
- `nit:` 前綴 = 非阻擋性建議（nice to have，不改也可以）
- Review 要及時，不要讓同事等太久

### 步驟 7：合併 PR

**方式 A：GitHub 網頁**
1. 點「Merge pull request」旁的小箭頭
2. 選「Squash and merge」
3. 確認 commit message，按「Confirm squash and merge」
4. 點「Delete branch」刪除遠端分支

**方式 B：用 gh CLI（一行搞定合併 + 刪除分支）**
```bash
gh pr merge --squash --delete-branch
```

**為什麼用 Squash and Merge：**
- 不管 branch 上有幾個 commit，合併到 main 時壓成 1 個
- main 的歷史保持乾淨，每個 commit 對應一個 PR
- commit message 後面會自動加上 `(#PR編號)`，方便追溯

---

## 第三階段：本地清理

### 方式 A：手動清理
```bash
git checkout main
git pull origin main
git branch -D feature/xxx
```

| 指令 | 說明 |
|------|------|
| `git checkout main` | 切回 main |
| `git pull origin main` | 拉取合併後的最新 main |
| `git branch -D feature/xxx` | 強制刪除本地分支。用大寫 `-D` 是因為 Squash and Merge 產生的新 commit 跟本地的不同，Git 認為分支「還沒合併」 |

### 方式 B：如果用 gh CLI 合併，會自動清理
```bash
gh pr merge --squash --delete-branch
```
這個指令會自動：切回 main、pull 最新、刪除本地和遠端分支。

---

## 解決 Conflict（衝突）

### 什麼時候會發生？
兩個人同時改了同一個檔案的同一段程式碼，先合併的那個沒問題，後合併的就會 conflict。

### 解決流程

**步驟 1：下載遠端最新狀態**
```bash
git fetch origin
```
> `fetch` 只下載資料，不會動到你的檔案。跟 `pull` 的差別：`pull` = `fetch` + `merge`。

**步驟 2：把 main 的改動合併進你的分支**
```bash
git merge origin/main
```
> Git 會嘗試自動合併，如果同一行有兩個不同的改動，就會標記 conflict。

**步驟 3：打開有衝突的檔案**
```
正常的程式碼...
<<<<<<< HEAD
    你的改動
=======
    main 上的改動（同事的）
>>>>>>> origin/main
正常的程式碼...
```

| 標記 | 意思 |
|------|------|
| `<<<<<<< HEAD` | 衝突開始，以下是你的版本 |
| `=======` | 分隔線 |
| `>>>>>>> origin/main` | 衝突結束，以上是 main 的版本 |

**步驟 4：手動決定保留什麼**
- 保留你的、保留 main 的、或合併兩個都可以
- 把 `<<<<<<<`、`=======`、`>>>>>>>` 三行標記全部刪掉

**步驟 5：存檔後 commit 並 push**
```bash
git add <衝突的檔案>
git commit -m "Resolve merge conflict"
git push
```

**步驟 6：回到 GitHub**
PR 頁面的 conflict 警告會自動消失，可以正常合併了。

---

## 指令速查表

### 日常開發流程
```bash
# 開新功能
git checkout main && git pull origin main
git checkout -b feature/xxx

# 開發 + 提交
git add <files>
git commit -m "描述這次改動"
git push -u origin feature/xxx

# 建立 PR
gh pr create --title "標題" --body "描述"

# 合併 + 清理（一行搞定）
gh pr merge --squash --delete-branch
```

### 解決衝突
```bash
git fetch origin
git merge origin/main
# 手動解決衝突後
git add <files>
git commit -m "Resolve merge conflict"
git push
```

### 其他常用指令
```bash
git status              # 查看目前狀態（有哪些改動）
git branch              # 列出所有本地分支
git branch -a           # 列出所有分支（含遠端）
git log --oneline       # 查看 commit 歷史（精簡版）
gh pr status            # 查看 PR 狀態
gh pr list              # 列出所有 PR
```

### 撤回操作（救命用）
```bash
git reset --soft HEAD~1  # 撤回最後一個 commit（保留檔案改動）
git restore <file>       # 還原檔案到上次 commit 的狀態
```

---

## GitHub 設定（Repo 管理者操作）

### Branch Protection（Ruleset）
Settings → Branches → Add branch ruleset：
- **Ruleset name**: `main-protection`
- **Enforcement status**: Active
- **Target branches**: Include default branch (main)
- **Restrict deletions**: 防止刪除 main
- **Require a pull request before merging**: 強制走 PR
  - Required approvals: 設為 1（需要 1 人 approve 才能合併）
- **Block force pushes**: 防止強制推送覆蓋歷史

### 合併策略
Settings → General → Pull Requests：
- 只勾選「Allow squash merging」
- 勾選「Automatically delete head branches」（合併後自動刪除遠端分支）

> 注意：Ruleset 在免費帳號的 private repo 不支援，需要 public repo 或 GitHub Team 方案。
