import './style.css'

const initialTasks = [
  { id: 1, title: 'サイトマップ比較の最終確認', category: 'Work', due: '今日', priority: 'high', done: false },
  { id: 2, title: '週次レポートをチームに共有', category: 'Work', due: '今日', priority: 'medium', done: false },
  { id: 3, title: '野菜とコーヒーを買う', category: 'Personal', due: '今日', priority: 'low', done: true },
  { id: 4, title: '新しい企画のラフを描く', category: 'Ideas', due: '明日', priority: 'medium', done: false },
  { id: 5, title: '本を30ページ読む', category: 'Personal', due: '8/27', priority: 'low', done: false },
]

let tasks = JSON.parse(localStorage.getItem('todo-tasks') || 'null') || initialTasks
let activeFilter = 'all'
let searchQuery = ''
const app = document.querySelector('#app')

function save() { localStorage.setItem('todo-tasks', JSON.stringify(tasks)) }
function icon(name) { return { plus: '+', search: '⌕', inbox: '▣', today: '○', upcoming: '◷', archive: '□', check: '✓', more: '•••', arrow: '→' }[name] || '' }
function taskList() {
  return tasks.filter((task) => {
    const filterMatch = activeFilter === 'all' || (activeFilter === 'today' ? task.due === '今日' : activeFilter === 'archive' ? task.done : task.category === activeFilter)
    return filterMatch && task.title.toLowerCase().includes(searchQuery.toLowerCase())
  })
}
function taskMarkup(task) {
  return `<article class="task ${task.done ? 'is-done' : ''}" data-id="${task.id}"><button class="check-button" data-action="toggle" aria-label="${task.done ? '未完了に戻す' : '完了にする'}">${task.done ? icon('check') : ''}</button><div class="task-copy"><h3>${task.title}</h3><div class="task-meta"><span class="tag tag-${task.category.toLowerCase()}">${task.category}</span><span>${task.due}</span></div></div><span class="priority priority-${task.priority}" title="優先度"></span><button class="icon-button more-button" data-action="delete" aria-label="タスクを削除">${icon('more')}</button></article>`
}
function render() {
  const visible = taskList(); const completed = tasks.filter((task) => task.done).length; const today = tasks.filter((task) => task.due === '今日'); const todayDone = today.filter((task) => task.done).length; const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  app.innerHTML = `<div class="app-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">✓</span><span>taskful</span></div><button class="add-task" data-action="new"><span>${icon('plus')}</span>新しいタスク</button><nav class="main-nav" aria-label="メインナビゲーション"><button class="nav-item ${activeFilter === 'all' ? 'active' : ''}" data-filter="all"><span>${icon('inbox')}</span>すべて <b>${tasks.length}</b></button><button class="nav-item ${activeFilter === 'today' ? 'active' : ''}" data-filter="today"><span>${icon('today')}</span>今日 <b>${today.length}</b></button><button class="nav-item"><span>${icon('upcoming')}</span>近日</button><button class="nav-item ${activeFilter === 'archive' ? 'active' : ''}" data-filter="archive"><span>${icon('archive')}</span>完了済み <b>${completed}</b></button></nav><div class="sidebar-label">リスト</div><nav class="list-nav"><button class="nav-item ${activeFilter === 'Work' ? 'active' : ''}" data-filter="Work"><i class="dot dot-work"></i>仕事</button><button class="nav-item ${activeFilter === 'Personal' ? 'active' : ''}" data-filter="Personal"><i class="dot dot-personal"></i>個人</button><button class="nav-item ${activeFilter === 'Ideas' ? 'active' : ''}" data-filter="Ideas"><i class="dot dot-ideas"></i>アイデア</button></nav><div class="sidebar-bottom"><button class="plain-button">⚙ 設定</button><p>集中できる一日を<br>つくっていこう。</p></div></aside><main class="main-content"><header class="topbar"><div><p class="eyebrow">MONDAY, AUGUST 24, 2026</p><h1>今日のタスク</h1></div><div class="top-actions"><button class="icon-button search-toggle" data-action="search" aria-label="検索">${icon('search')}</button><div class="avatar">NS</div></div></header><div class="search-row ${searchQuery ? 'visible' : ''}"><input id="search-input" placeholder="タスクを検索" value="${searchQuery}"><button data-action="clear-search">閉じる</button></div><section class="focus-panel"><div class="focus-title"><span class="sun-icon">☼</span><div><p class="section-kicker">TODAY'S FOCUS</p><h2>小さく始めて、最後まで。</h2></div></div><p class="focus-note">今日もひとつずつ、できることから。</p></section><section class="task-section"><div class="section-heading"><h2>タスク <span>${today.length}</span></h2><button class="sort-button">優先度順 ${icon('arrow')}</button></div><div class="tasks">${visible.length ? visible.map(taskMarkup).join('') : '<div class="empty-state">この条件のタスクはありません。<br>新しいタスクを追加しましょう。</div>'}</div><button class="inline-add" data-action="new"><span>${icon('plus')}</span>タスクを追加</button></section><section class="quote"><span>“</span><p>完璧にするより、<br><strong>前に進む。</strong></p><small>— 今日のリマインダー</small></section></main><aside class="right-panel"><div class="profile-row"><div><p class="eyebrow">YOUR OVERVIEW</p><h2>今週のまとめ</h2></div><button class="icon-button">${icon('more')}</button></div><div class="progress-card"><div class="progress-circle" style="--progress:${progress * 3.6}deg"><div><strong>${progress}%</strong><small>完了</small></div></div><div><p class="metric-label">週間の進捗</p><h3>いいペースです</h3><p class="muted">${completed} / ${tasks.length} タスク完了</p></div></div><div class="stat-grid"><div><strong>${todayDone}</strong><span>今日完了</span></div><div><strong>${Math.max(tasks.length - completed, 0)}</strong><span>残りのタスク</span></div></div><div class="week-card"><div class="mini-heading"><h3>今週の活動</h3><span>24 - 30 Aug</span></div><div class="week-bars"><i style="height:38%"><b>月</b></i><i style="height:68%"><b>火</b></i><i style="height:54%"><b>水</b></i><i style="height:82%"><b>木</b></i><i style="height:45%"><b>金</b></i><i style="height:25%"><b>土</b></i><i style="height:18%"><b>日</b></i></div></div><div class="tip-card"><span>✦</span><div><strong>今日のヒント</strong><p>一番大事なタスクを、午前中にひとつ終わらせよう。</p></div></div></aside></div>`
}
function todayISO() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
function formatDue(dateStr) {
  if (!dateStr) return '今日'
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  if (date.getTime() === today.getTime()) return '今日'
  if (date.getTime() === tomorrow.getTime()) return '明日'
  return `${date.getMonth() + 1}/${date.getDate()}`
}
function addTask() {
  const dialog = document.createElement('dialog')
  dialog.className = 'task-dialog'
  dialog.innerHTML = `<form method="dialog"><h2>新しいタスク</h2><label>タスク名<input name="title" required autofocus></label><label>リスト<select name="category"><option value="Work">仕事</option><option value="Personal">個人</option><option value="Ideas">アイデア</option></select></label><label>期限<input type="date" name="due" value="${todayISO()}"></label><div class="dialog-actions"><button type="button" data-action="cancel-task">キャンセル</button><button type="submit">追加</button></div></form>`
  document.body.append(dialog)

  dialog.addEventListener('close', () => dialog.remove())
  dialog.addEventListener('click', (event) => {
    if (event.target.dataset.action === 'cancel-task') dialog.close()
  })
  dialog.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title').trim()
    if (!title) return

    tasks.unshift({ id: Date.now(), title, category: formData.get('category'), due: formatDue(formData.get('due')), priority: 'medium', done: false })
    save()
    dialog.close()
    render()
  })
  dialog.showModal()
}
app.addEventListener('click', (event) => {
  const filter = event.target.closest('[data-filter]'); if (filter) { activeFilter = filter.dataset.filter; render(); return }
  const action = event.target.closest('[data-action]')?.dataset.action; if (action === 'new') addTask(); if (action === 'search') { document.querySelector('.search-row').classList.add('visible'); document.querySelector('#search-input')?.focus() }; if (action === 'clear-search') { searchQuery = ''; render() }
  const task = event.target.closest('.task'); if (task && action === 'toggle') { const item = tasks.find((entry) => entry.id === Number(task.dataset.id)); item.done = !item.done; save(); render() }; if (task && action === 'delete') { tasks = tasks.filter((entry) => entry.id !== Number(task.dataset.id)); save(); render() }
})
app.addEventListener('input', (event) => { if (event.target.id === 'search-input') { searchQuery = event.target.value; render(); document.querySelector('.search-row').classList.add('visible'); document.querySelector('#search-input')?.focus() } })
render()
