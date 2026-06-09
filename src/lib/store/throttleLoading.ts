import { Middleware } from '@reduxjs/toolkit';
import { setLoading as setLoadingAttr } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/atributos/services/AttributeSlice';
import { setLoading as setLoadingValue } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/atributos/[atributoId]/valores/services/AttributeValueSlice';

// Debounce para evitar múltiples inicios de carga en un corto período de tiempo
export const throttleLoading: Middleware = storeAPI => {
  const lastStartByType: Record<string, number> = {};
  const THROTTLE_MS = 1000; // 1 s minimo entre inicios de carga

  return next => action => {
    if (action && typeof action === 'object' && 'type' in action) {
      if (action.type === setLoadingAttr.type || action.type === setLoadingValue.type) {
        const payload = (action as unknown as { payload: boolean }).payload;
        if (payload) {
          const now = Date.now();
          const last = lastStartByType[action.type] || 0;
          if (now - last < THROTTLE_MS) {
            return;
          }
          lastStartByType[action.type] = now;
        }
      }
    }
    return next(action);
  };
};
