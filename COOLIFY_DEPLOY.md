# Guía de Despliegue en Coolify

## 📦 Despliegue desde Git Repository

### 1. Configuración Inicial en Coolify

1. **Crea un nuevo Proyecto** en Coolify
2. **Agrega un nuevo Resource** → Selecciona "Application"
3. **Conecta tu repositorio Git**:
   - GitHub, GitLab, o Git genérico
   - Selecciona la rama (ej: `main` o `master`)

### 2. Configuración del Build

En la configuración de tu aplicación en Coolify:

- **Build Pack**: `Dockerfile`
- **Dockerfile Location**: `./Dockerfile`
- **Port**: `8080`
- **Base Directory**: `/` (o deja vacío si el Dockerfile está en la raíz)

### 3. Variables de Entorno

Agrega las siguientes variables de entorno en Coolify:

```env
NODE_ENV=production
PORT=8080
NEXT_TELEMETRY_DISABLED=1

# Agrega cualquier otra variable que necesite tu aplicación
# Por ejemplo, URLs de API, claves, etc.
```

### 4. Build Settings

- **Auto Deploy**: ✅ Habilitado (si quieres despliegue automático en cada push)
- **Watch Paths**: `src/**, package.json, next.config.ts`

### 5. Health Check (Opcional pero recomendado)

- **Health Check Path**: `/`
- **Health Check Port**: `8080`
- **Health Check Interval**: `30s`

### 6. Recursos Recomendados

Para una aplicación Next.js mediana:

- **Memory**: 512MB - 1GB
- **CPU**: 0.5 - 1 vCPU

## 🚀 Desplegar

1. Guarda la configuración
2. Click en **Deploy**
3. Espera a que el build se complete (puede tomar 3-5 minutos)
4. Una vez completado, accede a tu aplicación a través de la URL proporcionada por Coolify

## 🔧 Troubleshooting

### Build Fails

Si el build falla:

1. Verifica los logs en Coolify
2. Asegúrate de que `package-lock.json` esté en el repositorio
3. Verifica que todas las dependencias estén correctamente listadas en `package.json`

### Application Crashes

1. Revisa los logs de la aplicación en Coolify
2. Verifica las variables de entorno
3. Asegúrate de que el puerto 8080 esté correctamente expuesto

### Problemas de Memoria

Si la aplicación se queda sin memoria:

1. Aumenta el límite de memoria en Coolify (Settings → Resources)
2. Considera optimizar el build de Next.js

## 📝 Notas Adicionales

- El Dockerfile usa Node.js 20 Alpine (versión ligera)
- Build multi-stage para optimizar el tamaño final
- La imagen final es ~100-200MB aproximadamente
- Usuario no-root para mayor seguridad

## 🔄 Actualizar la Aplicación

Si Auto Deploy está habilitado:
- Solo haz push a tu rama configurada y Coolify desplegará automáticamente

Si Auto Deploy NO está habilitado:
- Ve a tu aplicación en Coolify
- Click en **Redeploy**

## 🧪 Probar Localmente con Docker

Antes de desplegar en Coolify, puedes probar localmente:

```bash
# Build de la imagen
docker build -t sigeporcino-app .

# Ejecutar el contenedor
docker run -p 8080:8080 sigeporcino-app

# O usar docker-compose
docker-compose up --build
```

Accede a `http://localhost:8080` para verificar que funciona correctamente.

## 📚 Recursos Útiles

- [Documentación de Coolify](https://coolify.io/docs)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Next.js Standalone Output](https://nextjs.org/docs/advanced-features/output-file-tracing)
