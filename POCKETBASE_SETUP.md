# Configuración de PocketBase para Desastres/Emergencias

Este documento describe las colecciones que deben crearse en el panel de administración de PocketBase para que el módulo de Desastres/Emergencias funcione correctamente.

## 📋 Colecciones a Crear

### 1. `disaster_emergency_plans`

Esta colección almacena los planes de desastres y emergencias de las granjas.

**Campos:**

| Nombre del Campo | Tipo | Requerido | Opciones/Notas |
|-----------------|------|-----------|----------------|
| `user_id` | Relation | ✅ Sí | Relación con colección `users` |
| `farm_id` | Relation | ✅ Sí | Relación con colección `farms` |
| `riesgo_incendio` | Bool | No | Default: false |
| `riesgo_inundacion` | Bool | No | Default: false |
| `riesgo_terremoto` | Bool | No | Default: false |
| `riesgo_fallo_electrico` | Bool | No | Default: false |
| `riesgo_fallo_agua` | Bool | No | Default: false |
| `riesgo_enfermedad` | Bool | No | Default: false |
| `riesgo_otros` | Bool | No | Default: false |
| `nivel_riesgo` | Text | ✅ Sí | Opciones: "bajo", "medio", "alto" |
| `protocolo_evacuacion` | Text | No | (Long text/textarea) |
| `plan_comunicacion` | Text | No | (Long text/textarea) |
| `documentos_plan` | File | No | Permitir: .pdf, .doc, .docx (Max: 10MB) |
| `farm_name` | Text | No | (Copiado de la granja) |
| `rega_code` | Text | No | (Copiado de la granja) |

**Reglas de Acceso:**
- **List/Search:** `@request.auth.id != "" && user_id = @request.auth.id`
- **View:** `@request.auth.id != "" && user_id = @request.auth.id`
- **Create:** `@request.auth.id != "" && @request.data.user_id = @request.auth.id`
- **Update:** `@request.auth.id != "" && user_id = @request.auth.id`
- **Delete:** `@request.auth.id != "" && user_id = @request.auth.id`

---

### 2. `emergency_contacts`

Esta colección almacena los contactos de emergencia asociados a cada plan.

**Campos:**

| Nombre del Campo | Tipo | Requerido | Opciones/Notas |
|-----------------|------|-----------|----------------|
| `disaster_plan_id` | Relation | ✅ Sí | Relación con `disaster_emergency_plans` |
| `nombre` | Text | ✅ Sí | Nombre del contacto |
| `cargo` | Text | ✅ Sí | Cargo/posición del contacto |
| `telefono` | Text | ✅ Sí | Teléfono de contacto |
| `email` | Email | No | Email del contacto |

**Reglas de Acceso:**
- **List/Search:** `@request.auth.id != ""`
- **View:** `@request.auth.id != ""`
- **Create:** `@request.auth.id != ""`
- **Update:** `@request.auth.id != ""`
- **Delete:** `@request.auth.id != ""`

---

## 🔧 Pasos de Configuración

1. **Acceder al Panel de Administración de PocketBase**
   - Navega a tu instancia de PocketBase (por ejemplo: `http://localhost:8090/_/`)
   - Inicia sesión con tus credenciales de administrador

2. **Crear Colección: `disaster_emergency_plans`**
   - Click en "New collection"
   - Nombre: `disaster_emergency_plans`
   - Tipo: Base collection
   - Agregar cada uno de los campos listados arriba con sus configuraciones
   - Configurar las reglas de acceso

3. **Crear Colección: `emergency_contacts`**
   - Click en "New collection"
   - Nombre: `emergency_contacts`
   - Tipo: Base collection
   - Agregar cada uno de los campos listados arriba con sus configuraciones
   - Configurar las reglas de acceso

4. **Verificar Relaciones**
   - Asegúrate de que `user_id` apunte a la colección `users`
   - Asegúrate de que `farm_id` apunte a la colección `farms`
   - Asegúrate de que `disaster_plan_id` apunte a la colección `disaster_emergency_plans`

---

## ✅ Verificación

Una vez creadas las colecciones:

1. Reinicia tu aplicación React
2. Navega a: **Bienestar Animal → Desastres/Emergencias**
3. Intenta crear un nuevo plan de emergencia
4. Verifica que puedes:
   - ✅ Crear un plan
   - ✅ Editar un plan existente
   - ✅ Eliminar un plan
   - ✅ Agregar contactos de emergencia
   - ✅ Subir documentos

---

## 📝 Notas Adicionales

- Los campos `farm_name` y `rega_code` se copian automáticamente de la granja seleccionada
- Los contactos de emergencia se eliminan automáticamente cuando se elimina el plan asociado (configurar Cascade Delete en la relación si deseas esto)
- El campo `documentos_plan` debe tener un límite de tamaño de 10MB
- Solo se permiten archivos PDF, DOC y DOCX para los documentos

---

## 🐛 Solución de Problemas

**Error: "Failed to create record"**
- Verifica que las reglas de acceso estén configuradas correctamente
- Asegúrate de que el usuario esté autenticado
- Verifica que `user_id` y `farm_id` sean válidos

**Error: "Cannot upload file"**
- Verifica que el tipo de archivo sea .pdf, .doc o .docx
- Asegúrate de que el archivo sea menor a 10MB
- Verifica que el campo `documentos_plan` esté configurado como tipo File

**No se muestran los planes**
- Verifica que la regla de List/Search permita al usuario ver sus propios registros
- Asegúrate de que `currentFarm` esté seleccionada en el dropdown
