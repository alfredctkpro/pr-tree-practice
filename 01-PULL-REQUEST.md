# Pull Request 工作流程指南

## 一、原理：為什麼要用 Pull Request？

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

### 核心觀念
- **Branch（分支）**：從 main 岔出去的一條獨立開發線，改動不會影響 main
- **Pull Request**：在 GitHub 上發起「請求把我的 branch 合併回 main」的流程
- **Squash and Merge**：合併時把 branch 上所有 commit 壓成 1 個，保持 main 歷史乾淨
- **Branch Protection**：GitHub 上的設定，禁止直接 push main，強制走 PR 流程

---

## 二、最快完成 PR 流程的指令

```bash
# 1. 更新 main + 開分支
git checkout main && git pull origin main
git checkout -b feature/xxx

# 2. 開發 + 提交
git add <files>
git commit -m "描述這次改動"

# 3. 推送 + 建 PR + 合併 + 清理（全部用 gh CLI）
git push -u origin feature/xxx
gh pr create --title "標題" --body "描述"
gh pr merge --squash --delete-branch
```

> `gh pr merge --squash --delete-branch` 會自動完成：合併 PR、刪除遠端分支、刪除本地分支、切回 main、pull 最新。

---

## 三、完整流程（含說明）

### 完整流程圖

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

### 第一階段：本地開發

**步驟 1：確保 main 是最新的**
```bash
git checkout main
git pull origin main
```

| 指令 | 說明 |
|------|------|
| `git checkout main` | 切換到 main 分支（把 HEAD 指向 main） |
| `git pull origin main` | 從 GitHub 下載最新的 main 到本地（= `fetch` + `merge`） |

**步驟 2：建立新的 feature branch**
```bash
git checkout -b feature/xxx
```

| 參數 | 說明 |
|------|------|
| `checkout` | 切換分支 |
| `-b` | 建立新分支（branch 的縮寫）。不加 `-b` 只能切到已存在的分支 |
| `feature/xxx` | 分支名稱，依照命名慣例 |

**分支命名慣例：**
| 前綴 | 用途 | 範例 |
|------|------|------|
| `feature/` | 新功能 | `feature/add-login-page` |
| `fix/` | 修 bug | `fix/header-overlap` |
| `hotfix/` | 緊急修正 | `hotfix/security-patch` |
| `chore/` | 雜務 | `chore/update-dependencies` |
| `docs/` | 文件更新 | `docs/api-endpoints` |

規則：全小寫，用 `-` 連接單字。

**步驟 3：開發 + Commit**
```bash
git add index.html style.css
git commit -m "Add homepage with CSS styling"
```

| 指令 | 說明 |
|------|------|
| `git add <files>` | 把檔案的改動加入暫存區（包含新增、修改、刪除都要 add） |
| `git commit -m "..."` | 建立一個 commit，記錄這次的改動 |

> 可以多次 commit，最後 Squash and Merge 時會壓成一個。

**步驟 4：推送到 GitHub**
```bash
git push -u origin feature/xxx
```

| 參數 | 說明 |
|------|------|
| `-u` | upstream，設定追蹤關係。設定後之後只要打 `git push` 就好 |
| `origin` | 遠端倉庫（就是 GitHub） |
| `feature/xxx` | 要推送的分支名稱 |

> `-u` 只有第一次 push 新分支時需要加，之後不用。

### 第二階段：GitHub 遠端操作

**步驟 5：建立 Pull Request**

方式 A — GitHub 網頁：
1. 打開 repo 頁面，點擊黃色橫幅的「Compare & pull request」
2. 填寫 Title 和 Description
3. Assignees：指派自己（負責開發的人）
4. Reviewers：指派同事（負責審查的人）
5. 點「Create pull request」

方式 B — gh CLI：
```bash
gh pr create --title "Add homepage" --body "新增首頁"
```

> **Assignees vs Reviewers**：Assignee 是「誰寫的」，Reviewer 是「誰來審查」。

**步驟 6：Code Review**

Reviewer 在 GitHub 網頁上操作：
1. 點「Files changed」查看程式碼差異
2. 在程式碼行左邊點 `+` 號留下 comment
3. 點「Start a review」累積多則 comment（會變成 Pending）
4. 最後「Submit review」一次送出所有 Pending comments

| Review 選項 | 意思 | 什麼時候用 |
|------|------|------------|
| **Comment** | 只是留意見，不影響合併 | 一般討論 |
| **Approve** | 審查通過 | 程式碼沒問題 |
| **Request changes** | 要求修改，擋住合併 | 有問題必須改 |

Review 慣例：
- `nit:` 前綴 = 非阻擋性建議（nice to have，不改也可以）
- Review 要及時，不要讓同事等太久
- 「Resolve conversation」可以收合已處理的討論，非必要操作

> GitHub 不允許自己 approve 自己的 PR，只能留 comment。

**步驟 7：合併 PR**

方式 A — GitHub 網頁：
1. 點「Merge pull request」旁的小箭頭 ▼
2. 選「Squash and merge」
3. 確認 commit message（後面會自動加 `(#PR編號)`，方便追溯）
4. 按「Confirm squash and merge」
5. 點「Delete branch」刪除遠端分支

方式 B — gh CLI（一行搞定）：
```bash
gh pr merge --squash --delete-branch
```

**為什麼用 Squash and Merge：**
- 不管 branch 上有幾個 commit，合併到 main 時壓成 1 個
- main 的歷史保持乾淨，每個 commit 對應一個 PR
- commit message 後面自動加上 `(#PR編號)`，可以追溯到 PR 的討論

### 第三階段：本地清理

手動清理（如果沒用 `gh pr merge`）：
```bash
git checkout main
git pull origin main
git branch -D feature/xxx
```

| 指令 | 說明 |
|------|------|
| `git branch -D feature/xxx` | 強制刪除本地分支。用大寫 `-D` 是因為 Squash and Merge 產生的新 commit 跟本地的不同，Git 認為分支「還沒合併」，小寫 `-d` 會失敗 |

> 用 `gh pr merge --squash --delete-branch` 的話，以上清理全部自動完成。

---

## 四、解決 Conflict（衝突）

### 什麼時候會發生？
兩個人同時改了同一個檔案的同一段程式碼，先合併的沒問題，後合併的就會 conflict。

### 解決流程

**步驟 1：下載遠端最新狀態**
```bash
git fetch origin
```
> `fetch` 只下載資料，不會動到你的檔案。

**`fetch` vs `pull` 的差別：**
| 指令 | 作用 |
|------|------|
| `git fetch` | 只下載，不合併。你可以先看看有什麼改動再決定 |
| `git pull` | 下載 + 自動合併（= `fetch` + `merge`） |

**步驟 2：把 main 的改動合併進你的分支**
```bash
git merge origin/main
```
> 你是站在 feature 分支上，把 `origin/main` 拉進來。main 從頭到尾不會被動到。

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

## 五、補充指令

### 查看狀態
```bash
git status              # 查看目前狀態（有哪些改動）
git branch              # 列出所有本地分支（* 標記為目前所在分支）
git branch -a           # 列出所有分支（含遠端）
git log --oneline       # 查看 commit 歷史（精簡版）
git fetch --prune       # 清除本地記錄的、但遠端已刪除的分支
```

### gh CLI 常用指令
```bash
gh pr create --title "..." --body "..."   # 建立 PR
gh pr merge --squash --delete-branch       # 合併 + 清理
gh pr status                               # 查看 PR 狀態
gh pr list                                 # 列出所有 PR
gh pr diff                                 # 查看 PR 的 diff
gh pr view                                 # 查看 PR 詳細資訊
gh pr review --approve --body "LGTM!"      # Approve PR
gh pr review --comment --body "建議..."     # 留 comment
gh pr review --request-changes --body "..." # 要求修改
```

### 撤回操作（救命用）
```bash
git reset --soft HEAD~1  # 撤回最後一個 commit（保留檔案改動）
git restore <file>       # 還原檔案到上次 commit 的狀態
```

### 重新命名檔案
```bash
git mv old-name.md new-name.md  # 重新命名 + 告訴 Git 追蹤這個變更
```

### VS Code Git 狀態標記
| 標記 | 意思 | 顏色 |
|------|------|------|
| **U** | Untracked — 新檔案，Git 還沒追蹤 | 綠色 |
| **A** | Added — 已加入暫存區的新檔案 | 綠色 |
| **M** | Modified — 已修改 | 橘色 |
| **D** | Deleted — 已刪除 | 紅色 |
| **R** | Renamed — 已重新命名 | 綠色 |
| **C** | Conflict — 有衝突待解決 | 紅色 |

---

## 六、GitHub 設定（Repo 管理者操作）

### Branch Protection（Ruleset）
Settings → Branches → Add branch ruleset：
- **Ruleset name**: `main-protection`
- **Enforcement status**: Active
- **Target branches**: Include default branch (main)
- **Restrict deletions**: 防止刪除 main
- **Require a pull request before merging**: 強制走 PR
  - Required approvals: 設為 1（需要 1 人 approve 才能合併）
- **Block force pushes**: 防止強制推送覆蓋歷史

> 注意：Ruleset 在免費帳號的 private repo 不支援，需要 public repo 或 GitHub Team 方案。

### 合併策略
Settings → General → Pull Requests：
- 只勾選「Allow squash merging」
- 勾選「Automatically delete head branches」（合併後自動刪除遠端分支）
