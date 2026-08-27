# QA — Test Cases: Perfil de Usuario

## Bug Report: Error al guardar perfil

**Archivo afectado:** `src/app/(tabs)/profile.tsx`
**Función afectada:** `handleSaveProfile`
**Severidad:** Alta — impide guardar cambios en el perfil

---

## Casos de Prueba

| ID | Precondición | Pasos para replicar | Datos de prueba | Resultado esperado |
|----|-------------|---------------------|-----------------|-------------------|
| TC-01 | Usuario autenticado con perfil creado en Firestore. Sin foto de perfil. | 1. Navegar a la pestaña "Perfil"<br>2. Tocar "Editar Perfil"<br>3. Cambiar el nombre a "Juan Modified"<br>4. Tocar "Guardar Cambios" | Nombre: `"Juan Modified"`<br>Foto: ninguna (sin seleccionar) | Los cambios se aplicaron correctamente. Se muestra alerta "¡Listo! Perfil actualizado". El nombre se actualiza a "Juan Modified" en la pantalla de perfil. |
| TC-02 | Usuario autenticado con perfil creado en Firestore. Sin foto de perfil. | 1. Navegar a la pestaña "Perfil"<br>2. Tocar "Editar Perfil"<br>3. Seleccionar una foto de la galería<br>4. Tocar "Guardar Cambios" | Nombre: sin cambiar<br>Foto: imagen seleccionada de galería | Los cambios se aplicaron correctamente. Se muestra alerta "¡Listo! Perfil actualizado". La foto de perfil se muestra correctamente en el avatar. |
| TC-03 | Usuario autenticado con perfil que ya tiene foto de perfil. | 1. Navegar a la pestaña "Perfil"<br>2. Tocar "Editar Perfil"<br>3. Cambiar el nombre a "María Updated"<br>4. Tocar "Guardar Cambios" | Nombre: `"María Updated"`<br>Foto: ninguna (sin cambiar la existente) | Los cambios se aplicaron correctamente. El nombre se actualiza. La foto de perfil existente se mantiene visible (no se borra ni se sobrescribe con null). |
| TC-04 | Usuario autenticado con perfil que ya tiene foto de perfil. | 1. Navegar a la pestaña "Perfil"<br>2. Tocar "Editar Perfil"<br>3. Seleccionar una foto diferente de la galería<br>4. Tocar "Guardar Cambios" | Nombre: sin cambiar<br>Foto: nueva imagen seleccionada | Los cambios se aplicaron correctamente. La nueva foto reemplaza la anterior en el avatar. |
| TC-05 | Usuario autenticado con perfil creado. | 1. Navegar a la pestaña "Perfil"<br>2. Tocar "Editar Perfil"<br>3. Dejar el nombre vacío<br>4. Tocar "Guardar Cambios" | Nombre: `""` (vacío)<br>Foto: cualquiera | Se muestra alerta de error: "El nombre no puede estar vacío". No se realiza ninguna petición a Firestore. |
| TC-06 | Usuario autenticado. Editando perfil. | 1. Navegar a la pestaña "Perfil"<br>2. Tocar "Editar Perfil"<br>3. Cambiar el nombre<br>4. Tocar "Cancelar" | Nombre: `"Test Cancel"` | Los cambios NO se guardan. Se vuelve al modo de solo lectura con el nombre original. |
| TC-07 | Usuario autenticado con perfil creado. Con conexión a internet. | 1. Navegar a la pestaña "Perfil"<br>2. Tocar "Editar Perfil"<br>3. Cambiar el nombre a "Offline Test"<br>4. Activar modo avión<br>5. Tocar "Guardar Cambios" | Nombre: `"Offline Test"`<br>Conexión: sin internet | Se muestra alerta de error: "No se pudo actualizar el perfil". Los cambios no se aplican localmente. |
| TC-08 | Usuario autenticado con perfil creado. | 1. Navegar a la pestaña "Perfil"<br>2. Tocar "Editar Perfil"<br>3. Cambiar el nombre<br>4. Tocar "Guardar Cambios"<br>5. Navegar a otra pestaña<br>6. Volver a "Perfil" | Nombre: `"Persist Test"` | Los cambios se aplicaron correctamente. Al volver a la pestaña Perfil, se muestra el nombre actualizado (no el anterior). |

---

## Flujo esperado (TC-01, TC-03 — casos principales del bug)

```
1. Usuario toca "Editar Perfil"
2. Aparece modo edición con campo de nombre y opción de foto
3. Usuario modifica el nombre (o no)
4. Usuario toca "Guardar Cambios"
5. Se muestra ActivityIndicator (botón deshabilitado)
6. Se ejecuta: uploadUserAvatar() solo si photoUri != null
7. Se ejecuta: updateUserProfile(uid, { displayName, photoURL })
8. Se actualiza el estado local setProfile(...)
9. Se sale del modo edición
10. Se muestra Alert "¡Listo! Perfil actualizado"
11. El perfil muestra la información actualizada
```

## Bug #1: photoURL undefined se envía a Firestore

**Causa raíz:** En `handleSaveProfile`, cuando no se selecciona foto, `photoURL` queda como `undefined`. Esto se pasa a `updateUserProfile()` que lo envía a Firestore, causando que el campo se sobrescriba con `null`.

**Fix:** Filtrar `undefined` antes de enviar a Firestore.
- `profile.tsx`: Solo incluir `photoURL` en update si tiene valor
- `userService.ts`: `updateUserProfile()` filtra `undefined`

**Estado:** ✅ Corregido

---

## Bug #2: Upload de foto falla — EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME vacío

**Archivo afectado:** `src/services/cloudinary.ts`
**Severidad:** Alta — impide subir cualquier foto (perfil y mascotas)

| ID | Precondición | Pasos para replicar | Datos de prueba | Resultado esperado |
|----|-------------|---------------------|-----------------|-------------------|
| TC-09 | `.env` tiene `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=` (vacío) | 1. Ir a Perfil<br>2. Editar Perfil<br>3. Seleccionar foto<br>4. Guardar | Foto: imagen de galería | Los cambios se aplicaron correctamente. La foto se muestra en el avatar. |
| TC-10 | `.env` tiene cloud name configurado | 1. Ir a Perfil<br>2. Editar Perfil<br>3. Seleccionar foto<br>4. Guardar | Foto: imagen de galería | Los cambios se aplicaron correctamente. La foto se muestra en el avatar. |

**Causa raíz:** `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` está vacío en `.env`. Sin el cloud name, la URL de Cloudinary es `https://api.cloudinary.com/v1_1//image/upload` (inválida), y el upload siempre falla.

**Fix aplicado:**
1. `cloudinary.ts`: Valida que `CLOUD_NAME` no esté vacío antes de intentar upload. Si está vacío, lanza error descriptivo.
2. `profile.tsx`: Si el upload falla, muestra alerta informativa pero **continúa guardando el nombre** (no bloquea todo el perfil por un error de foto).
3. `cloudinary.ts`: Warning en consola cuando falta el cloud name.

**Pendiente:** El usuario debe configurar `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` en `.env` con su cloud name real de Cloudinary.

---

## Bug #3: Firestore bloquea lectura/escritura en users — Missing or insufficient permissions

**Archivo afectado:** `scripts/firestore.rules`
**Severidad:** Alta — impide leer y actualizar cualquier perfil de usuario

| ID | Precondición | Pasos para replicar | Datos de prueba | Resultado esperado |
|----|-------------|---------------------|-----------------|-------------------|
| TC-11 | Firestore rules desplegadas. Usuario autenticado. | 1. Login<br>2. Navegar a pestaña Perfil | Cualquier usuario autenticado | Los cambios se aplicaron correctamente. El perfil carga con nombre, email y foto. |
| TC-12 | Firestore rules desplegadas. Usuario autenticado. | 1. Ir a Perfil<br>2. Editar nombre<br>3. Guardar | Nombre: "Nuevo Nombre" | Los cambios se aplicaron correctamente. El nombre se actualiza. |
| TC-13 | Firestore rules desplegadas. Usuario autenticado. | 1. Ir a Perfil<br>2. Editar foto<br>3. Guardar | Foto: imagen de galería | Los cambios se aplicaron correctamente. La foto se muestra en el avatar. |

**Causa raíz:** Las reglas de Firestore en `scripts/firestore.rules` nunca se desplegaron a Firebase. Las reglas por defecto bloquean toda lectura/escritura. El archivo `firebase.json` no existía.

**Fix aplicado:**
1. Creado `firebase.json` apuntando a `scripts/firestore.rules`
2. Creado `scripts/firestore.indexes.json` (requerido por firebase.json)
3. Reglas ya existen y son correctas: `allow read: if request.auth != null` y `allow update: if request.auth.uid == uid`

**Estado:** ✅ Desplegado — `firebase deploy --only firestore:rules` ejecutado exitosamente

---

## Bug #4: Cloudinary — Unsupported FormDataPart implementation

**Archivo afectado:** `src/services/cloudinary.ts`
**Severidad:** Alta — impide subir cualquier foto

| ID | Precondición | Pasos para replicar | Datos de prueba | Resultado esperado |
|----|-------------|---------------------|-----------------|-------------------|
| TC-14 | Cloudinary configurado en `.env` | 1. Ir a Perfil<br>2. Editar<br>3. Seleccionar foto<br>4. Guardar | Foto: imagen de galería | Los cambios se aplicaron correctamente. La foto se muestra en el avatar. |
| TC-15 | Cloudinary configurado | 1. Crear mascota<br>2. Seleccionar foto<br>3. Guardar | Foto: imagen de galería | Los cambios se aplicaron correctamente. La foto se muestra en la tarjeta de la mascota. |

**Causa raíz:** React Native no soporta pasar `{ uri, type, name }` directamente a `FormData.append()`. El runtime lanza `Unsupported FormDataPart implementation`.

**Fix:** Usar `expo-file-system` para leer el archivo como base64 y enviarlo como `data:image/jpeg;base64,...` a Cloudinary.

**Estado:** ✅ Corregido

---

## Bug #5: Firestore — No document to update en perfil

**Archivo afectado:** `src/services/userService.ts`
**Severidad:** Alta — impide actualizar perfil de usuario

| ID | Precondición | Pasos para replicar | Datos de prueba | Resultado esperado |
|----|-------------|---------------------|-----------------|-------------------|
| TC-16 | Usuario nuevo (sin doc en Firestore `users/`) | 1. Login<br>2. Ir a Perfil<br>3. Editar nombre<br>4. Guardar | Nombre: "Test User" | Los cambios se aplicaron correctamente. El nombre se guarda y se muestra. |
| TC-17 | Usuario con doc existente en Firestore | 1. Ir a Perfil<br>2. Editar nombre<br>3. Guardar | Nombre: "Updated Name" | Los cambios se aplicaron correctamente. El nombre se actualiza. |

**Causa raíz:** `updateUserProfile()` usaba `updateDoc()` que requiere que el documento exista. Si el usuario se registró pero el doc `users/{uid}` no se creó (o se borró), `updateDoc` falla con `No document to update`.

**Fix:** Cambiar `updateDoc()` por `setDoc()` con `{ merge: true }`. Esto crea el documento si no existe, o lo mergea si ya existe.

**Estado:** ✅ Corregido

---

## Bug #6: Deprecated API — readAsStringAsync de expo-file-system

**Archivo afectado:** `src/services/cloudinary.ts`
**Severidad:** Media — warning en consola, puede dejar de funcionar en futuras versiones

| ID | Precondición | Pasos para replicar | Datos de prueba | Resultado esperado |
|----|-------------|---------------------|-----------------|-------------------|
| TC-18 | Expo SDK 57, expo-file-system v57 | 1. Ir a Perfil<br>2. Editar<br>3. Seleccionar foto<br>4. Guardar | Foto: imagen de galería | Los cambios se aplicaron correctamente. Sin warnings en consola. |

**Causa raíz:** `readAsStringAsync` de `expo-file-system` fue deprecado en SDK 57. El warning indica migrar a la nueva API `File` y `Directory`.

**Fix:** Reemplazar `readAsStringAsync` por la clase `File` de `expo-file-system` que implementa `Blob` directamente. Se pasa el `File` a `FormData.append()` sin conversión a base64.

**Estado:** ✅ Corregido

---

## Bug #7: Cloudinary — Transformation parameter not allowed en upload unsigned

**Archivo afectado:** `src/services/cloudinary.ts`
**Severidad:** Alta — impide subir fotos

| ID | Precondición | Pasos para replicar | Datos de prueba | Resultado esperado |
|----|-------------|---------------------|-----------------|-------------------|
| TC-19 | Cloudinary configurado, upload preset unsigned | 1. Ir a Perfil<br>2. Editar<br>3. Seleccionar foto<br>4. Guardar | Foto: imagen de galería | Los cambios se aplicaron correctamente. La foto se sube y se muestra. |
| TC-20 | Cloudinary configurado | 1. Crear mascota<br>2. Seleccionar foto<br>3. Guardar | Foto: imagen de galería | Los cambios se aplicaron correctamente. La foto se muestra en la mascota. |

**Causa raíz:** Cloudinary rechaza el parámetro `transformation` en uploads con preset unsigned. Solo permite: `upload_preset`, `folder`, `public_id`, `tags`, `context`, `metadata`, etc.

**Fix:** Eliminar `formData.append("transformation", ...)` del FormData. Las transformaciones (resize, quality) se configuran en el dashboard de Cloudinary o se aplican on-the-fly en las URLs.

**Estado:** ✅ Corregido

---

## Estado General

| Bug | Estado | Verificación |
|-----|--------|-------------|
| #1 photoURL undefined | ✅ Corregido | Filtrado en profile.tsx + userService.ts |
| #2 Cloudinary sin cloud name | ✅ Corregido | Validación + `.env` configurado |
| #3 Firestore permissions | ✅ Desplegado | `firebase deploy --only firestore:rules` |
| #4 FormDataPart unsupported | ✅ Corregido | Clase File de expo-file-system como Blob |
| #5 No document to update | ✅ Corregido | `setDoc` con `merge: true` |
| #6 Deprecated readAsStringAsync | ✅ Corregido | Migrado a nueva API File |
| #7 Transformation not allowed | ✅ Corregido | Eliminado parámetro del FormData |

**Resultado esperado (TC-01 a TC-20):** Los cambios se aplicaron correctamente.

---

## Bug #8: Rutas pet/create, pet/[id], pet/edit/[id] se muestran como tabs

**Archivo afectado:** `src/app/(tabs)/_layout.tsx`
**Severidad:** Media — UX confusa, rutas internas visibles en la barra de tabs

| ID | Precondición | Pasos para replicar | Datos de prueba | Resultado esperado |
|----|-------------|---------------------|-----------------|-------------------|
| TC-21 | App abierta,任何tab activo | 1. Observar la barra de tabs inferior | — | Solo se muestran 4 tabs: Inicio, Mis Mascotas, Aprender, Perfil. No aparecen pet/create, pet/[id] ni pet/edit/[id]. |
| TC-22 | Tab "Mis Mascotas" activo | 1. Tocar "+" o una mascota<br>2. Navegar a crear/editar/detalle<br>3. Observar barra de tabs | — | Las sub-pantallas se abren pero la barra de tabs no cambia. No se agregan tabs nuevos. |

**Causa raíz:** Las rutas `pet/create.tsx`, `pet/[id].tsx` y `pet/edit/[id].tsx` están dentro de la carpeta `(tabs)/pet/`, lo que hace que expo-router las trate como pantallas de tab y las muestre en la barra inferior.

**Fix:** Agregar `Tabs.Screen` entries con `href: null` y `headerShown: false` para cada ruta de mascota. Esto las mantiene como rutas navegables pero ocultas del tab bar.

**Estado:** ✅ Corregido

---

## Estado General

| Bug | Estado | Verificación |
|-----|--------|-------------|
| #1 photoURL undefined | ✅ Corregido | Filtrado en profile.tsx + userService.ts |
| #2 Cloudinary sin cloud name | ✅ Corregido | Validación + `.env` configurado |
| #3 Firestore permissions | ✅ Desplegado | `firebase deploy --only firestore:rules` |
| #4 FormDataPart unsupported | ✅ Corregido | Clase File de expo-file-system como Blob |
| #5 No document to update | ✅ Corregido | `setDoc` con `merge: true` |
| #6 Deprecated readAsStringAsync | ✅ Corregido | Migrado a nueva API File |
| #7 Transformation not allowed | ✅ Corregido | Eliminado parámetro del FormData |
| #8 Pet routes showing as tabs | ✅ Corregido | `href: null` en Tabs.Screen |

**Resultado esperado (TC-01 a TC-22):** Los cambios se aplicaron correctamente.
