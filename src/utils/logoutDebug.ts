// Utility para debug e limpeza de marcadores órfãos de logout
// Use no console do browser em produção se necessário

export const logoutDebugUtils = {
  // Verificar estado atual dos marcadores
  checkLogoutMarkers() {
    const logoutInProgress = sessionStorage.getItem('logout_in_progress');
    const logoutTimestamp = sessionStorage.getItem('logout_timestamp');
    
    console.log('🔍 Logout Debug Status:');
    console.log('  → logout_in_progress:', logoutInProgress);
    console.log('  → logout_timestamp:', logoutTimestamp);
    
    if (logoutTimestamp) {
      const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);
      console.log('  → Time since logout:', (timeSinceLogout / 1000).toFixed(1), 'seconds');
      
      if (timeSinceLogout > 30000) {
        console.log('  ⚠️ OLD MARKER DETECTED - should be cleaned');
      }
    }
    
    return { logoutInProgress, logoutTimestamp };
  },
  
  // Forçar limpeza de todos os marcadores
  clearAllLogoutMarkers() {
    console.log('🧹 Forcing cleanup of all logout markers');
    sessionStorage.removeItem('logout_in_progress');
    sessionStorage.removeItem('logout_timestamp');
    localStorage.removeItem('is_authenticated');
    console.log('✅ All logout markers cleared');
  },
  
  // Simular um logout limpo
  simulateCleanLogout() {
    console.log('🔄 Simulating clean logout...');
    this.clearAllLogoutMarkers();
    
    // Força reload da página
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
};

// Tornar disponível globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).logoutDebug = logoutDebugUtils;
}
