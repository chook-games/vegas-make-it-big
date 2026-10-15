export const Bus = {
  _map: new Map(),
  on(evt, fn) {
    if (!this._map.has(evt)) this._map.set(evt, new Set());
    this._map.get(evt).add(fn);
    return () => this.off(evt, fn);
  },
  off(evt, fn) {
    const set = this._map.get(evt);
    if (set) set.delete(fn);
  },
  emit(evt, data) {
    const set = this._map.get(evt);
    if (!set) return;
    for (const fn of Array.from(set)) {
      try { fn(data); } catch (err) { console.error('Bus handler error for', evt, err); }
    }
  }
};

export const EV = {
  UI_REFRESH: 'ui:refresh',
  TOOL_SELECT: 'tool:select',
  PLACEMENT_UPDATE: 'placement:update',
  INSPECTOR_OPEN: 'inspector:open',
  INSPECTOR_CLOSE: 'inspector:close',
  VIEW_SWITCH: 'view:switch',
  TOAST: 'ui:toast',
  FLOATING: 'ui:floating',
  CASH_CHANGED: 'cash:changed',
  QUEST_PROGRESS: 'quest:progress',
  GAME_TICK: 'game:tick',
  DAY_PASSED: 'day:passed',
  REPUTATION_CHANGED: 'reputation:changed',
  BUILDING_PLACED: 'building:placed',
  BUILDING_SOLD: 'building:sold',
  EVENT_ACTIVE: 'event:active',
  SHAKE: 'fx:shake'
};
