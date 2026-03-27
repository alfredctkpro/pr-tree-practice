# Git Tag & GitHub Release 指南

## 一、原理：為什麼要用 Tag / Release？

### 問題情境
你的專案已經合併了很多 PR，但哪一個 commit 是「正式上線的版本」？光看 commit 歷史很難判斷。

### Tag 解決了什麼
- **標記里程碑**：在特定的 commit 上打一個標籤，表示「這是 v1.0.0」
- **隨時回溯**：未來出問題可以快速回到某個穩定版本
- **部署依據**：CI/CD 可以根據 tag 自動部署對應版本

### Tag vs Release
| | Tag | Release |
|---|---|---|
| **是什麼** | Git 的功能，標記一個 commit | GitHub 的功能，基於 tag 加上說明和附件 |
| **在哪裡** | 本地 + 遠端都有 | 只在 GitHub 上 |
| **內容** | 只有一個名稱指向某個 commit | 可以附上更新說明、變更紀錄、附件檔案 |

> 簡單理解：Tag 是書籤，Release 是書籤 + 附帶的說明頁。

---

## 二、最快完成 Tag / Release 的指令

```bash
# 建立 Release（會自動建立對應的 tag）
gh release create v1.0.0 --target main --title "v1.0.0" --notes "第一個正式版本"
```

一行搞定，tag 和 release 同時建好。

---

## 三、完整流程（含說明）

### 什麼時候打 Tag？

| 時機 | 範例 | 說明 |
|------|------|------|
| 功能到達一個里程碑 | `v1.0.0` | 第一個正式版本上線 |
| 累積幾個 PR 後，準備部署 | `v1.1.0` | 新增了幾個功能，推上正式環境 |
| 緊急修復上線後 | `v1.1.1` | hotfix 合併後立刻打 tag |

**實務上的節奏：**
```
PR #1 合併 → main
PR #2 合併 → main
PR #3 合併 → main
覺得可以上線了 → gh release create v1.1.0
部署 v1.1.0 到正式環境

發現 bug → hotfix PR → 合併
→ gh release create v1.1.1
立刻部署修復
```

> 不需要每個 PR 都打 tag。等到「這個版本可以上線了」再打。

### 版本號慣例（Semantic Versioning）

格式：**v主版本.次版本.修訂版**

| 版本號變動 | 什麼時候 | 範例 |
|---|---|---|
| **主版本** | 大改版、不相容的變更 | `v1.0.0` → `v2.0.0`（網站全面改版） |
| **次版本** | 新增功能，向下相容 | `v1.0.0` → `v1.1.0`（加了新頁面） |
| **修訂版** | 修 bug，沒有新功能 | `v1.1.0` → `v1.1.1`（修了 CSS 跑版） |

### 建立方式

**方式 A：gh CLI（推薦）**
```bash
# 基本用法
gh release create v1.0.0 --target main

# 加上標題和說明
gh release create v1.0.0 --target main --title "v1.0.0 首次發布" --notes "包含首頁、CSS 樣式、JavaScript 互動"

# 自動產生變更紀錄（根據 commit 歷史）
gh release create v1.1.0 --target main --generate-notes
```

**方式 B：純 Git Tag（不建立 GitHub Release）**
```bash
# 建立 tag
git tag v1.0.0

# 推送 tag 到遠端
git push origin v1.0.0

# 推送所有 tag
git push origin --tags
```

**方式 C：GitHub 網頁**
1. 進入 repo 頁面
2. 右側找到「Releases」→「Create a new release」
3. 填寫 tag 名稱、標題、說明
4. 點「Publish release」

---

## 四、補充指令

### 查看 Tag
```bash
git tag                     # 列出所有本地 tag
git tag -l "v1.*"           # 列出符合條件的 tag
git show v1.0.0             # 查看某個 tag 的詳細資訊
```

### 查看 Release
```bash
gh release list             # 列出所有 release
gh release view v1.0.0      # 查看某個 release 的詳細資訊
```

### 刪除 Tag / Release
```bash
# 刪除 release（保留 tag）
gh release delete v1.0.0

# 刪除本地 tag
git tag -d v1.0.0

# 刪除遠端 tag
git push origin --delete v1.0.0
```

### 回到某個版本
```bash
# 查看某個版本的程式碼（唯讀）
git checkout v1.0.0

# 基於某個版本建立新分支來修改
git checkout -b hotfix/from-v1.0.0 v1.0.0
```
