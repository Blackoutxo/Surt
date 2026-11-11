export const log = {
    info: (...a) => console.log('[Info]', ...a),
    error: (...e) => console.log('[Error]', ...e),
    warning: (...w) => console.log('[WARNING]', ...w),
};