# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Huellitas! Esta guía te ayudará a empezar.

---

## 📋 Índice

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Ambiente de Desarrollo](#ambiente-de-desarrollo)
- [Convenciones de Código](#convenciones-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

---

## 📜 Código de Conducta

- Sé respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en lo que es mejor para la comunidad
- Muestra empatía hacia otros miembros

---

## 🎯 Cómo Contribuir

### Tipos de Contribución

1. **🐛 Reportar Bugs** - Encuentras un error? Abrí un issue
2. **💡 Sugerir Funcionalidades** - Tenés una idea? Abrí un issue
3. **📝 Mejorar Documentación** - Corregí errores o agregá contenido
4. **🔧 Corregir Bugs** - Abrí un PR con la corrección
5. **✨ Agregar Funcionalidades** - Abrí un PR con la feature

---

## 🛠 Ambiente de Desarrollo

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado)
- Git
- Cuenta de GitHub
- Expo CLI (`npx expo`)
- Firebase CLI (para reglas)

### Pasos para Configurar

```bash
# 1. Fork el repositorio en GitHub

# 2. Cloná tu fork
git clone https://github.com/TU_USUARIO/huellitas.git
cd huellitas

# 3. Agregá el remote upstream
git remote add upstream https://github.com/USUARIO_ORIGINAL/huellitas.git

# 4. Instalá dependencias
pnpm install

# 5. Configurá las variables de entorno
cp .env.example .env
# Editá .env con tus credenciales

# 6. Iniciá el servidor de desarrollo
pnpm start
```

### Estructura de Branches

```
main (producción)
  └── develop (desarrollo)
       ├── feature/nueva-funcionalidad
       ├── bugfix/corregir-error
       └── docs/mejorar-documentacion
```

---

## 📝 Convenciones de Código

### Nomenclatura

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Componentes | PascalCase | `PetCard.tsx` |
| Funciones | camelCase | `createPet()` |
| Variables | camelCase | `petName` |
| Constantes | UPPER_SNAKE_CASE | `MAX_PHOTOS` |
| Archivos (componentes) | kebab-case | `pet-card.tsx` |
| Archivos (servicios) | camelCase | `petService.ts` |
| Archivos (tipos) | camelCase | `index.ts` |

### Estructura de un Componente

```typescript
// Imports externos
import React from "react";
import { View, Text } from "react-native";

// Imports internos
import { Pet } from "@/types";
import { PetCard } from "@/components/pet-card";

// Props interface
interface MyComponentProps {
  pet: Pet;
  onPress: (id: string) => void;
}

// Component
export function MyComponent({ pet, onPress }: MyComponentProps) {
  // Hooks
  const [loading, setLoading] = useState(false);

  // Functions
  const handlePress = () => {
    onPress(pet.id);
  };

  // Render
  return (
    <View>
      <Text>{pet.name}</Text>
    </View>
  );
}
```

### Estructura de un Service

```typescript
// Imports
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// Types
interface CreatePetData {
  name: string;
  species: string;
}

// Functions
export async function createPet(data: CreatePetData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "pets"), {
      ...data,
      createdAt: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw error;
  }
}
```

### Estilos (NativeWind)

```tsx
// ✅ Correcto - utility classes
<View className="flex-1 bg-white dark:bg-gray-900 p-4">
  <Text className="text-lg font-bold text-gray-800 dark:text-white">
    Título
  </Text>
</View>

// ❌ Incorrecto - no usar estilos inline
<View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
  <Text style={{ fontSize: 18, fontWeight: "bold" }}>Título</Text>
</View>
```

### TypeScript

```typescript
// ✅ Correcto - tipos explícitos
interface Pet {
  id: string;
  name: string;
  species: "Perro" | "Gato";
}

function getPet(id: string): Promise<Pet> {
  // ...
}

// ❌ Incorrecto - evitar any
function getPet(id: any): Promise<any> {
  // ...
}
```

---

## 🔀 Proceso de Pull Request

### 1. Crear una Branch

```bash
# Actualizá develop
git checkout develop
git pull upstream develop

# Creá tu branch
git checkout -b feature/mi-nueva-funcionalidad
```

### 2. Hacer Cambios

```bash
# Hacé tus cambios
# ...

# Verificá que todo funcione
pnpm lint
npx tsc --noEmit

# Commiteá con mensajes descriptivos
git add .
git commit -m "feat(pets): agregar sistema de favoritos"
```

### Formato de Commits

```
tipo(alcance): descripción corta

[opcional] descripción más detallada

[opcional] issues cerrados: #123
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (no afecta lógica)
- `refactor`: Refactorización
- `test`: Agregar tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```
feat(pets): agregar sistema de favoritos
fix(auth): corregir logout que no limpiaba sesión
docs(readme): agregar sección de configuración
```

### 3. Push y Crear PR

```bash
# Push a tu fork
git push origin feature/mi-nueva-funcionalidad
```

Luego en GitHub:
1. Ir a "Pull requests" → "New pull request"
2. Seleccioná tu branch
3. Agregá título descriptivo
4. Agregá descripción con:
   - Qué cambiaste
   - Por qué lo cambiaste
   - Cómo probarlo
   - Screenshots (si aplica)

### 4. Code Review

- Esperá a que un maintainer revise tu PR
- Hacé los cambios solicitados
- El PR será merged cuando sea aprobado

---

## 🐛 Reportar Bugs

### Template para Issues

```markdown
## Descripción del Bug

[Describí claramente el bug]

## Pasos para Reproducir

1. Ir a '...'
2. Hacer click en '...'
3. Scroll down a '...'
4. Ver error

## Comportamiento Esperado

[Describí qué debería pasar]

## Screenshots

[Si aplica, agregá screenshots]

## Entorno

- Dispositivo: [ej: iPhone 14, Pixel 7]
- OS: [ej: iOS 17.2, Android 14]
- Versión de Expo: [ej: SDK 57]
- Versión de la app: [ej: 1.0.0]
```

---

## 💡 Sugerir Funcionalidades

### Template para Issues

```markdown
## Descripción de la Funcionalidad

[Describí la funcionalidad que querés]

## Caso de Uso

[Describí por qué sería útil]

## Solución Propuesta

[Si tenés una idea de cómo implementarla]

## Alternativas Consideradas

[Otras formas de resolverlo]

## Additional Context

[Más contexto, screenshots, etc.]
```

---

## 📚 Recursos Útiles

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

---

## ❓ Preguntas

Si tenés preguntas, abrí un issue con el tag `question`.

---

¡Gracias por contribuir! 🐾
