<template>
  <nav style="display: flex; gap: 12px; padding: 12px">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/migrador-notas">Migrador de XMLs</RouterLink>
    <RouterLink to="/imposto-renda">Imposto de Renda</RouterLink>
  </nav>

  <RouterView />
</template>
