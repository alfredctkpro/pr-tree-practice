# Git Worktree 工作流程指南

## 一、原理：為什麼要用 Worktree？

### 問題情境
你在 `feature/add-footer` 上開發到一半，突然接到通知：main 上有 bug 要緊急修。

**沒有 Worktree 的做法：**
```bash
git stash                    # 把寫到一半的東西暫存
git checkout main            # 切回 main
git checkout -b hotfix/xxx   # 開 hotfix 分支
# 修 bug → commit → push → PR → merge
git checkout feature/add-footer  # 切回來
git stash pop                    # 取回暫存的東西
```
→ 要來回切換，容易搞混，而且 stash 可能會有衝突。

**有 Worktree 的做法：**
```bash
git worktree add ../pr-tree-hotfix -b hotfix/xxx origin/main
cd ../pr-tree-hotfix
# 修 bug → commit → push → PR → merge
cd ../pr-tree-practice
git worktree remove ../pr-tree-hotfix
# 繼續開發，完全沒被打斷
```
→ 兩個資料夾，各自在不同分支上工作，互不干擾。

### 核心觀念
- Worktree 讓你**同時開多個工作目錄**，每個目錄在不同的分支上
- 所有 worktree **共用同一個 `.git`**，不是 clone 兩份 repo
- 在任何一個資料夾裡 commit，另一個資料夾都看得到 commit 歷史
- **Worktree 是本地端的機制**，對 GitHub 遠端來說就是普通的分支，GitHub 不知道你用了 worktree

### 重要限制
- Worktree 資料夾**必須建在 repo 外面**，不能建在 repo 裡面
- 建在上一層（`../`）是慣例，方便找

```
/Users/alfred/pr-tree-practice/     ← 主 repo（feature 分支）
/Users/alfred/pr-tree-hotfix/       ← worktree（hotfix 分支）
```

---

## 二、最快完成 Worktree 流程的指令

```bash
# 建立 worktree + 修 bug + PR + 合併
git worktree add ../pr-tree-hotfix -b hotfix/xxx origin/main
cd ../pr-tree-hotfix
# 修改檔案
git add <files> && git commit -m "Fix bug"
git push -u origin hotfix/xxx
gh pr create --title "Fix bug" --body "描述"
gh pr merge --squash --delete-branch

# 清理 + 回到原本的 feature
cd /Users/alfred/pr-tree-practice
git worktree remove ../pr-tree-hotfix

# 同步 main 的改動到 feature
git add <files> && git commit -m "WIP: 開發中"
git fetch origin && git merge origin/main
git push -u origin feature/xxx
gh pr create --title "..." --body "..."
gh pr merge --squash --delete-branch
```

---

## 三、完整流程（含說明）

### 完整流程圖

```
主 repo（feature 分支）              Worktree（hotfix 分支）
─────────────────────              ────────────────────────
你在 feature 寫到一半
         │
         ├─── git worktree add ──→  建立新資料夾
         │                          cd 過去
         │                          修 bug
         │                          commit → push → PR → merge
         │                          cd 回主 repo
         ├─── git worktree remove   刪除 worktree
         │
繼續開發 feature
fetch origin
merge origin/main（同步 hotfix 的改動）
commit → push → PR → merge
```

### 步驟 1：建立 Worktree

```bash
git worktree add ../pr-tree-hotfix -b hotfix/xxx origin/main
```

| 參數 | 說明 |
|------|------|
| `../pr-tree-hotfix` | 新資料夾的路徑（必須在 repo 外面） |
| `-b hotfix/xxx` | 建立新分支 |
| `origin/main` | 基於遠端 main 來建立（確保是最新的 main） |

### 步驟 2：切到 Worktree 修 bug

```bash
cd ../pr-tree-hotfix
```

在 VS Code 裡，可以 **File → New Window → Open Folder** 開 `pr-tree-hotfix` 資料夾，這樣兩個視窗各自在不同分支上。

### 步驟 3：修完後走正常 PR 流程

```bash
git add <files>
git commit -m "Fix critical bug"
git push -u origin hotfix/xxx
gh pr create --title "Fix bug" --body "描述"
gh pr merge --squash --delete-branch
```

> 記得先 `git push -u` 再 `gh pr create`，不然 gh 會問你要推到哪個遠端。

### 步驟 4：清理 Worktree，回到 Feature

```bash
cd /Users/alfred/pr-tree-practice
git worktree remove ../pr-tree-hotfix
```

回來後，你的 feature 分支上的改動完全沒被影響。

### 步驟 5：把 Hotfix 的改動同步到 Feature

因為 main 已經被 hotfix 更新了，你的 feature 分支還是舊的，需要同步：

```bash
# 先把寫到一半的東西 commit（不然 merge 會失敗）
git add <files>
git commit -m "WIP: 開發中"

# 同步 main
git fetch origin
git merge origin/main
# 如果有 conflict，手動解決後 → git add → git commit
```

> `WIP` = Work In Progress，表示還沒完成。反正 Squash and Merge 會壓成一個 commit，過程中的 commit message 不影響最終結果。

---

## 四、補充指令

### Worktree 管理
```bash
git worktree list                # 列出所有 worktree（路徑 + 所在分支）
git worktree add <路徑> -b <分支> origin/main  # 建立 worktree
git worktree remove <路徑>       # 移除 worktree（資料夾會被刪除）
```

### Worktree 可以放在哪裡？
```bash
git worktree add ../pr-tree-hotfix ...         # 上一層（推薦，方便找）
git worktree add ~/Desktop/hotfix ...          # 桌面
git worktree add /tmp/hotfix ...               # 暫存目錄
```

只要不在 repo 裡面就好。

### Stash（暫存改動的替代方案）
如果只是短暫切換，不需要開 worktree，可以用 stash：

```bash
git stash               # 暫存目前的改動
git checkout main       # 去做別的事
# 做完後
git checkout feature/xxx
git stash pop           # 取回暫存的改動
```

Worktree 適合「要做比較久的事」，Stash 適合「快速切換一下就回來」。
