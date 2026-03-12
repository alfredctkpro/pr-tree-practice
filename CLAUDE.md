# PR Tree Practice

## 專案目的
這是一個 Git + GitHub Pull Request 工作流程的練習專案，供 2 人小型開發團隊學習使用。

## 團隊背景
- 2 人開發團隊，Tech Lead + 1 位開發者
- 熟悉 git commit、push、pull
- 正在學習：branching、Pull Request、Code Review
- 主要技術棧：PHP、CSS、JavaScript

## 採用的工作流程：GitHub Flow

### 核心規則
- `main` 分支永遠是可部署的狀態
- 所有開發都在 feature branch 上進行
- 透過 Pull Request 合併回 `main`
- 合併策略：**Squash and Merge**（每個 PR = main 上一個 commit）

### 分支命名慣例
- `feature/描述` — 新功能（例：`feature/add-login-page`）
- `fix/描述` — 修正 bug（例：`fix/header-overlap`）
- `hotfix/描述` — 緊急修正
- `chore/描述` — 雜務（例：`chore/update-dependencies`）
- `docs/描述` — 文件更新
- 全小寫，用 `-` 連接單字

### 本地端操作流程
```bash
# 1. 確保 main 是最新的
git checkout main
git pull origin main

# 2. 建立新分支
git checkout -b feature/xxx

# 3. 開發 + commit（可多次）
git add <files>
git commit -m "描述這次改動"

# 4. 推送分支到遠端
git push -u origin feature/xxx

# 5. 合併完成後，清理本地
git checkout main
git pull origin main
git branch -d feature/xxx
```

### 遠端 (GitHub) 操作流程
1. Push 後到 GitHub 建立 Pull Request
2. 指派 Reviewer 進行 Code Review
3. Reviewer: Comment / Approve / Request Changes
4. 通過後 Squash and Merge
5. 合併後自動刪除遠端 feature branch

### 同步 main 的方式（開發中 main 被更新時）
```bash
git checkout feature/xxx
git fetch origin
git merge origin/main
# 解決衝突後 → git add → git commit → git push
```

### Code Review 慣例
- 至少 1 人 approve 才能合併
- `nit:` 前綴 = 非阻擋性建議
- Review 要及時，不要拖延

## GitHub 設定
- [x] Branch Protection：禁止直接 push main（已透過 Ruleset 設定）
- [ ] Branch Protection：需要 1 人 approve（等同事加入後再開啟）
- [ ] 合併策略設定為僅允許 Squash and Merge
- [ ] 合併後自動刪除 feature branch

## 練習進度
- [x] 步驟 0：初始化 main 分支（initial commit + push）
- [x] 步驟 1：建立 feature branch
- [x] 步驟 2：寫程式 + commit
- [x] 步驟 3：push 分支 + 建立 PR
- [x] 步驟 4：Code Review 流程
- [x] 步驟 5：Merge PR + 清理分支
- [x] 步驟 6：同步 main + 清理本地分支
- [x] 步驟 7：設定 Branch Protection Rules
