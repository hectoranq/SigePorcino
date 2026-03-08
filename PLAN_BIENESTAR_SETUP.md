# Plan de Bienestar Animal - Configuración de PocketBase

Este documento proporciona instrucciones para configurar las colecciones de PocketBase necesarias para el módulo "Plan de Bienestar Animal y Plan de Acción" basado en el Real Decreto 306/2020.

## Resumen

El módulo consta de 6 pasos (colecciones) que cubren diferentes aspectos del bienestar animal en granjas porcinas:

1. **plan_bienestar_step1** - Condiciones Generales
2. **plan_bienestar_step2** - Manejo y Personal
3. **plan_bienestar_step3** - Alimentación y Abrevado
4. **plan_bienestar_step4** - Material Manipulable
5. **plan_bienestar_step5** - Condiciones Ambientales
6. **plan_bienestar_step6** - Plan de Acción

---

## 1. Colección: plan_bienestar_step1

**Nombre:** `plan_bienestar_step1`  
**Tipo:** Base  
**Descripción:** Condiciones generales de las instalaciones y fases productivas

### Campos:

| Campo | Tipo | Requerido | Opciones | Descripción |
|-------|------|-----------|----------|-------------|
| `user_id` | Relation | ✅ | Collection: users | ID del usuario |
| `farm_id` | Relation | ✅ | Collection: farms | ID de la granja |
| `fases_productivas` | JSON | ✅ | | Array de objetos con fase y num_naves |
| `orientacion_naves` | Text | ✅ | | Orientación de las naves (ej: Noreste) |
| `num_animales_presentes` | Number | ✅ | Min: 0 | Número total de animales |
| `aislamiento_cerramientos` | Text | ✅ | | Tipo de aislamiento estructural |
| `aislamiento_cubierta` | Text | ✅ | | Tipo de aislamiento de cubierta |
| `densidad_carga` | Number | ✅ | Min: 0, Step: 0.01 | m² por animal |
| `tipo_suelo` | Text | ✅ | | Tipo de suelo (ej: Parcialmente emparrillado) |

### Reglas de API:
```
List: @request.auth.id != ""
View: @request.auth.id != ""
Create: @request.auth.id != ""
Update: @request.auth.id != "" && user_id = @request.auth.id
Delete: @request.auth.id != "" && user_id = @request.auth.id
```

### Índices:
- `farm_id` (para búsquedas rápidas por granja)
- `user_id, farm_id` (índice compuesto único)

---

## 2. Colección: plan_bienestar_step2

**Nombre:** `plan_bienestar_step2`  
**Tipo:** Base  
**Descripción:** Manejo de animales y personal de la granja

### Campos:

| Campo | Tipo | Requerido | Opciones | Descripción |
|-------|------|-----------|----------|-------------|
| `user_id` | Relation | ✅ | Collection: users | ID del usuario |
| `farm_id` | Relation | ✅ | Collection: farms | ID de la granja |
| `fases_manejo` | JSON | ✅ | | Array con inspecciones por fase |
| `frecuencia_limpieza` | Text | ✅ | | Frecuencia de limpieza de corralinas |
| `num_trabajadores` | Number | ✅ | Min: 0 | Número de trabajadores |
| `trabajadores_formacion_bienestar` | Bool | ❌ | Default: false | Formación en bienestar animal |
| `separacion_tamanos` | Bool | ❌ | Default: false | Separación por tamaños |
| `separacion_enfermos_heridos` | Bool | ❌ | Default: false | Separación de enfermos/heridos |
| `separacion_otros` | Text | ❌ | | Otras separaciones realizadas |

### Reglas de API:
```
List: @request.auth.id != ""
View: @request.auth.id != ""
Create: @request.auth.id != ""
Update: @request.auth.id != "" && user_id = @request.auth.id
Delete: NO DISPONIBLE (no se permite borrar este paso)
```

### Índices:
- `farm_id`
- `user_id, farm_id` (índice compuesto único)

---

## 3. Colección: plan_bienestar_step3

**Nombre:** `plan_bienestar_step3`  
**Tipo:** Base  
**Descripción:** Alimentación y sistemas de abrevado

### Campos:

| Campo | Tipo | Requerido | Opciones | Descripción |
|-------|------|-----------|----------|-------------|
| `user_id` | Relation | ✅ | Collection: users | ID del usuario |
| `farm_id` | Relation | ✅ | Collection: farms | ID de la granja |
| `fases_alimentacion` | JSON | ✅ | | Array con datos de alimentación por fase |
| `alimentacion_racionada` | Bool | ❌ | Default: false | Si la alimentación es racionada |
| `num_comidas_dia` | Number | ✅ | Min: 0 | Número de comidas al día |
| `porcentaje_fibra_pienso` | Number | ✅ | Min: 0, Max: 100 | % de fibra en el pienso |
| `origen_agua_bebida` | Text | ✅ | | Origen del agua (ej: Red pública) |
| `control_calidad_agua` | Text | ✅ | | Control de calidad del agua |

### Reglas de API:
```
List: @request.auth.id != ""
View: @request.auth.id != ""
Create: @request.auth.id != ""
Update: @request.auth.id != "" && user_id = @request.auth.id
Delete: NO DISPONIBLE
```

### Índices:
- `farm_id`
- `user_id, farm_id` (índice compuesto único)

---

## 4. Colección: plan_bienestar_step4

**Nombre:** `plan_bienestar_step4`  
**Tipo:** Base  
**Descripción:** Material manipulable y enriquecimiento ambiental

### Campos:

| Campo | Tipo | Requerido | Opciones | Descripción |
|-------|------|-----------|----------|-------------|
| `user_id` | Relation | ✅ | Collection: users | ID del usuario |
| `farm_id` | Relation | ✅ | Collection: farms | ID de la granja |
| `fases_material` | JSON | ✅ | | Array con datos de material por fase |
| `num_tipos_diferentes` | Number | ✅ | Min: 0 | Nº de tipos diferentes de material |
| `consideracion_material` | Select | ✅ | Values: optimo, mejorable, no_apto | Evaluación del material |
| `periodicidad_renovacion` | Text | ✅ | | Periodicidad de renovación |

### Reglas de API:
```
List: @request.auth.id != ""
View: @request.auth.id != ""
Create: @request.auth.id != ""
Update: @request.auth.id != "" && user_id = @request.auth.id
Delete: NO DISPONIBLE
```

### Índices:
- `farm_id`
- `user_id, farm_id` (índice compuesto único)

---

## 5. Colección: plan_bienestar_step5

**Nombre:** `plan_bienestar_step5`  
**Tipo:** Base  
**Descripción:** Condiciones ambientales y sistemas de control

### Campos:

| Campo | Tipo | Requerido | Opciones | Descripción |
|-------|------|-----------|----------|-------------|
| `user_id` | Relation | ✅ | Collection: users | ID del usuario |
| `farm_id` | Relation | ✅ | Collection: farms | ID de la granja |
| `fases_ambiental` | JSON | ✅ | | Array con control ambiental por fase (8 bools) |
| `gases_indicados` | Text | ✅ | | Gases a controlar (ej: CO2, NH3) |
| `gases_registrados` | Bool | ❌ | Default: false | Si se registran los gases |
| `extractores_ventiladores` | Bool | ❌ | Default: false | Presencia de extractores |
| `apertura_automatica_ventanas` | Bool | ❌ | Default: false | Apertura automática ventanas |
| `apertura_automatica_chimeneas` | Bool | ❌ | Default: false | Apertura automática chimeneas |
| `cumbreras` | Bool | ❌ | Default: false | Presencia de cumbreras |
| `coolings` | Bool | ❌ | Default: false | Sistemas de cooling |
| `nebulizacion` | Bool | ❌ | Default: false | Sistemas de nebulización |
| `ventilacion_total_artificial` | Bool | ❌ | Default: false | Ventilación total artificial |
| `calefaccion` | Bool | ❌ | Default: false | Sistemas de calefacción |
| `iluminacion` | Text | ✅ | | Tipo de iluminación |

### Reglas de API:
```
List: @request.auth.id != ""
View: @request.auth.id != ""
Create: @request.auth.id != ""
Update: @request.auth.id != "" && user_id = @request.auth.id
Delete: NO DISPONIBLE
```

### Índices:
- `farm_id`
- `user_id, farm_id` (índice compuesto único)

---

## 6. Colección: plan_bienestar_step6

**Nombre:** `plan_bienestar_step6`  
**Tipo:** Base  
**Descripción:** Plan de acción con riesgos e indicadores

### Campos:

| Campo | Tipo | Requerido | Opciones | Descripción |
|-------|------|-----------|----------|-------------|
| `user_id` | Relation | ✅ | Collection: users | ID del usuario |
| `farm_id` | Relation | ✅ | Collection: farms | ID de la granja |
| `riesgos_identificados` | Text | ❌ | | Riesgos identificados en la evaluación |
| `riesgos_inmediatos` | Text | ❌ | | Riesgos a resolver inmediatamente |
| `riesgos_corto_plazo` | Text | ❌ | | Riesgos a resolver en 1-3 meses |
| `riesgos_medio_plazo` | Text | ❌ | | Riesgos a resolver en 3-6 meses |
| `riesgos_largo_plazo` | Text | ❌ | | Riesgos a resolver en más de 6 meses |
| `num_asuntos_tratar` | Text | ❌ | | Número de asuntos prioritarios |
| `personas_responsables` | Text | ❌ | | Personas responsables del plan |
| `indicadores_exito` | Text | ❌ | | Indicadores para evaluar el éxito |

### Reglas de API:
```
List: @request.auth.id != ""
View: @request.auth.id != ""
Create: @request.auth.id != ""
Update: @request.auth.id != "" && user_id = @request.auth.id
Delete: NO DISPONIBLE
```

### Índices:
- `farm_id`
- `user_id, farm_id` (índice compuesto único)

---

## Pasos de Configuración

### 1. Crear las Colecciones

Para cada colección (plan_bienestar_step1 hasta plan_bienestar_step6):

1. En el Admin UI de PocketBase, ir a **Collections** > **New collection**
2. Seleccionar tipo **Base**
3. Introducir el nombre de la colección (exactamente como se especifica arriba)
4. Agregar todos los campos según la tabla de especificación
5. Configurar las reglas de API como se indica
6. Crear los índices especificados

### 2. Configurar Relations

Las relaciones `user_id` y `farm_id` deben configurarse con:
- **Collection:** users (para user_id) o farms (para farm_id)
- **Cascade delete:** OFF (para mantener históricos)
- **Display fields:** Seleccionar `email` para users, `farm_name` para farms

### 3. Validaciones Importantes

- Asegurarse de que los campos JSON (`fases_productivas`, `fases_manejo`, etc.) **NO** tengan validación de esquema activada
- Los campos de tipo Select deben tener los valores exactos especificados (optimo, mejorable, no_apto)
- Los campos Number con decimales deben especificar `step: 0.01` o similar

### 4. Índices Compuestos

Crear índice único compuesto en **todas las colecciones**:
```
user_id + farm_id (unique: true)
```
Esto asegura que cada usuario solo tenga un plan por granja.

---

## Estructura JSON de las Fases

### Step 1 - fases_productivas
```json
[
  { "fase": "GESTACIÓN SIN CONFIRMAR", "num_naves": 2 },
  { "fase": "GESTACIÓN CONFIRMADA", "num_naves": 2 },
  { "fase": "PARIDERA", "num_naves": 2 },
  { "fase": "TRANSICIÓN", "num_naves": 2 },
  { "fase": "CEBO", "num_naves": 2 },
  { "fase": "REPOSICIÓN", "num_naves": 2 },
  { "fase": "VERRACOS", "num_naves": 2 },
  { "fase": "LAZARETO", "num_naves": 2 }
]
```

### Step 2 - fases_manejo
```json
[
  {
    "fase": "GESTACIÓN SIN CONFIRMAR",
    "num_inspecciones_dia": 3,
    "num_inspecciones_equipamiento_dia": 2
  }
  // ... (8 fases en total)
]
```

### Step 3 - fases_alimentacion
```json
[
  {
    "fase": "GESTACIÓN SIN CONFIRMAR",
    "alimentacion_ad_libitum": true,
    "tipo_comedero": "Tolva",
    "longitud_comedero": 0.30,
    "tipo_bebederos": "Chupete",
    "num_bebederos": 1
  }
  // ... (8 fases en total)
]
```

### Step 4 - fases_material
```json
[
  {
    "fase": "GESTACIÓN SIN CONFIRMAR",
    "tipo_material": "Cadenas",
    "localizacion": "Centro del corral",
    "num_puntos_acceso": 1,
    "animales_activos": 80,
    "animales_interaccionando": 20
  }
  // ... (8 fases en total)
]
```

### Step 5 - fases_ambiental
```json
[
  {
    "fase": "GESTACIÓN SIN CONFIRMAR",
    "sensores_temperatura": true,
    "control_temperatura": true,
    "registro_temperatura": true,
    "sensores_humedad": false,
    "control_humedad": false,
    "registro_humedad": false,
    "iluminacion_automatica": true,
    "registro_iluminacion": false
  }
  // ... (8 fases en total)
]
```

---

## Navegación en la Aplicación

Una vez configuradas las colecciones en PocketBase:

1. Iniciar sesión en la aplicación
2. Seleccionar una granja en el selector de granjas
3. Navegar a: **Bienestar Animal → Plan de Acción**
4. Completar los 6 pasos del formulario en orden
5. Los datos se guardan automáticamente al hacer clic en "Guardar y Continuar"
6. El stepper muestra el progreso a través de las secciones

---

## Notas Técnicas

### Archivos Creados

**Action Layer (PocketBase):**
- `/src/action/PlanBienestarStep1Pocket.ts`
- `/src/action/PlanBienestarStep2Pocket.ts`
- `/src/action/PlanBienestarStep3Pocket.ts`
- `/src/action/PlanBienestarStep4Pocket.ts`
- `/src/action/PlanBienestarStep5Pocket.ts`
- `/src/action/PlanBienestarStep6Pocket.ts`

**Presentation Layer (React Components):**
- `/src/components/sections/PlanBienestarAccionStep1.tsx`
- `/src/components/sections/PlanBienestarAccionStep2.tsx`
- `/src/components/sections/PlanBienestarAccionStep3.tsx`
- `/src/components/sections/PlanBienestarAccionStep4.tsx`
- `/src/components/sections/PlanBienestarAccionStep5.tsx`
- `/src/components/sections/PlanBienestarAccionStep6.tsx`

**Coordinator:**
- `/src/components/sections/MainPlanBienestarAccion.tsx`

**Integration:**
- `/src/pages/home/index.tsx` (modificado para incluir el nuevo módulo)

### Dependencias

- Material-UI: Stepper, Step, StepLabel, Table, TextField, Checkbox, etc.
- PocketBase: Colecciones y autenticación
- Stores: `useUserStore`, `useFarmFormStore`
- Estilos: `buttonStyles` (back/next buttons)

### Fases Productivas Estándar

Las 8 fases productivas son fijas y se utilizan en todos los pasos:
1. GESTACIÓN SIN CONFIRMAR
2. GESTACIÓN CONFIRMADA
3. PARIDERA
4. TRANSICIÓN
5. CEBO
6. REPOSICIÓN
7. VERRACOS
8. LAZARETO

---

## Checklist de Testing

Después de configurar PocketBase, probar:

- [ ] Cada usuario puede crear solo un plan por granja (índice único funciona)
- [ ] Los datos JSON se guardan y cargan correctamente
- [ ] La navegación entre pasos funciona (onNext/onBack)
- [ ] Los valores por defecto se aplican correctamente
- [ ] Las validaciones de campos requeridos funcionan
- [ ] El stepper muestra el paso activo correctamente
- [ ] Los datos persisten al navegar entre pasos
- [ ] La edición de planes existentes funciona (update)
- [ ] Los campos de solo lectura no son editables
- [ ] Los índices mejoran el rendimiento de búsqueda

---

## Soporte

Para problemas de configuración, consultar:
- Documentación oficial de PocketBase: https://pocketbase.io/docs/
- Real Decreto 306/2020 (documento de referencia: `plandeaccion.md`)
- Módulo de referencia: Desastres/Emergencias (`POCKETBASE_SETUP.md`)

---

**Fecha de creación:** 2024  
**Versión:** 1.0  
**Autor:** Sistema de desarrollo SIGE Porcino
