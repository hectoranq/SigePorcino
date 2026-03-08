# PLAN DE BIENESTAR ANIMAL
## PLAN DE ACCIÓN

Este documento tiene como objetivo servir de orientación para la elaboración del Plan de bienestar animal establecido en el Real Decreto 306/2020, de 11 de febrero, por el que se establecen normas básicas de ordenación de las granjas porcinas intensivas, y se modifica la normativa básica de ordenación de las explotaciones de ganado porcino extensivo.

Se incluye específicamente un apartado para el método de matanza de animales (art. 19 del Reglamento (CE) nº 1099/2009, de 29 de septiembre, relativo a la protección de los animales en el momento de la matanza).

---

## Requerimientos del Formulario "Plan de Bienestar Animal"

El formulario estará dividido en **6 secciones principales** (pestañas o pasos de un stepper), cada una correspondiente a una tabla o grupo de información del documento.

### Estructura General:
- **Título:** PLAN DE BIENESTAR ANIMAL
- **Subtítulo:** Basado en el Real Decreto 306/2020 y Reglamento (CE) nº 1099/2009.
- **Navegación:** Seis pestañas o un stepper de seis pasos.

---

## Pestaña/Step 1: CONDICIONES GENERALES

Esta sección recopila la información general de la granja y la distribución por fases productivas.

| # | Etiqueta del Campo | Tipo de Dato | Opciones / Formato | ¿Requerido? | Notas / Validación |
|:---|:---|:---|:---|:---:|:---|
| 1.1 | Fase Productiva | (Título de tabla) | N/A | N/A | Este campo es un encabezado de tabla. Las fases son: GESTACIÓN SIN CONFIRMAR, GESTACIÓN CONFIRMADA, PARIDERA, TRANSICIÓN, CEBO, REPOSICIÓN, VERRACOS, LAZARETO. |
| 1.2 | Nº NAVES (por fase) | Número entero | | Sí | Por cada fase productiva listada en 1.1, debe haber un campo para introducir el número de naves. Valor por defecto: 2. |
| 1.3 | Orientación de la nave | Texto | | Sí | Campo de texto libre. Valor por defecto: "Noreste". |
| 1.4 | Nº ANIMALES PRESENTES | Número entero | | Sí | Número total de animales en la granja. Valor por defecto: 910. |
| 1.5 | Tipo de aislamiento estructural de cerramientos | Texto | | Sí | Ej: "Ladrillo", "Hormigón", "Panel Sandwich". Valor por defecto: "Ladrillo". |
| 1.6 | Tipo de aislamiento estructural de cubierta | Texto | | Sí | Ej: "Fibrocemento+Polietileno", "Panel Sandwich". Valor por defecto: "Fibrocemento+Poliuretano". |
| 1.7 | Densidad de carga (m² por animal) | Número decimal | | Sí | Ej: 0.65 (mínimo 2 decimales). Valor por defecto: 0.65. |
| 1.8 | Tipo de suelo | Texto | | Sí | Ej: "Parcialmente emparrillado", "Emparrillado completo", "Cama caliente". Valor por defecto: "Parcialmente emparrillado". |

---

## Pestaña/Step 2: MANEJO Y PERSONAL

Esta sección detalla las rutinas de inspección y el personal de la granja.

| # | Etiqueta del Campo | Tipo de Dato | Opciones / Formato | ¿Requerido? | Notas |
|:---|:---|:---|:---|:---:|:---|
| 2.1 | Fase Productiva | (Título de tabla) | N/A | N/A | Mismas fases que en pestaña 1.1. |
| 2.2 | Nº de inspecciones a los animales / día | Número entero | | Sí | Valor por defecto: 1. |
| 2.3 | Nº de inspecciones/día de equipamiento automático | Número entero | | Sí | Valor por defecto: 1. |
| 2.4 | Frecuencia de limpieza de las cuadras | Texto | | Sí | Ej: "Diaria", "Semanal", "Por lotes". |
| 2.5 | Número de trabajadores | Número entero | | Sí | Valor por defecto: 1. |
| 2.6 | ¿Cuántos trabajadores tienen formación en Bienestar Animal? | Número entero | | Sí | Validar que no sea mayor que "Número de trabajadores". Valor por defecto: 1. |
| 2.7 | ¿Separación por tamaños? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "Sí". |
| 2.8 | ¿Separación enfermos y/o heridos? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "Sí". |
| 2.9 | ¿Separación de ? | Texto | | No | Campo de texto libre para otros tipos de separación. Valor por defecto: "d/ ?". |

---

## Pestaña/Step 3: ALIMENTACIÓN Y ABREVADO

Esta sección se enfoca en los sistemas de alimentación y agua.

| # | Etiqueta del Campo | Tipo de Dato | Opciones / Formato | ¿Requerido? | Notas |
|:---|:---|:---|:---|:---:|:---|
| 3.1 | Fase Productiva | (Título de tabla) | N/A | N/A | Mismas fases que en pestaña 1.1. |
| 3.2 | Alimentación *Ad libitum* | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "Sí". |
| 3.3 | Tipo de comedero | Texto | | Sí | Ej: "Tolva", "Canal". Valor por defecto: "Tolva". |
| 3.4 | Longitud (cm) o Superficie comedero (cm²) / nº animales | Texto | | Sí | Valor por defecto: "2200 / 3000 cm2". |
| 3.5 | Alimentación racionada | Selección (Sí/No) | Sí, No | Sí | |
| 3.6 | Nº de comidas /día | Número entero | | No | Requerido solo si "Alimentación racionada" es "Sí". |
| 3.7 | % fibra en pienso | Número decimal | | No | Ej: 0-100%. |
| 3.8 | Tipo de bebederos | Texto | | Sí | Ej: "Cazoleta", "Chupete". Valor por defecto: "Cazoleta". |
| 3.9 | Nº bebederos / Nº animales por bebedero | Texto | | Sí | Ej: "5 / 10". |
| 3.10 | Origen del agua de bebida | Texto | | Sí | Ej: "Pozo", "Red municipal". Valor por defecto: "Pozo". |
| 3.11 | ¿Control de calidad del agua de bebida? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "Sí". |

---

## Pestaña/Step 4: MATERIAL MANIPULABLE / NIDO

Esta sección detalla los elementos de enriquecimiento ambiental para los animales.

| # | Etiqueta del Campo | Tipo de Dato | Opciones / Formato | ¿Requerido? | Notas |
|:---|:---|:---|:---|:---:|:---|
| 4.1 | Fase Productiva | (Título de tabla) | N/A | N/A | Mismas fases que en pestaña 1.1. |
| 4.2 | Tipo de material | Texto | | Sí | Ej: "Tubos de caucho", "Cuerdas", "Madera". Valor por defecto: "Tubos de caucho o plastico blando". |
| 4.3 | Localización | Texto | | Sí | Ej: "Suspendidos", "Suelo". Valor por defecto: "Suspendidos". |
| 4.4 | Nº de puntos de acceso al material manipulable por corral | Número entero | | Sí | Valor por defecto: 1. |
| 4.5 | Si hay más de un tipo de material, ¿Cuántos son diferentes? | Número entero | | No | Requerido si se usa más de un tipo. |
| 4.6 | Considera este material... (según Decisión Comisión) | Selección (Óptimo/Mejorable/No apto) | Óptimo, Mejorable, No apto | Sí | Valor por defecto: "Óptimo". |
| 4.7 | Periodicidad de renovación (por semanas) | Número entero | | Sí | Ej: 1, 2, 4. |
| 4.8 | Número de animales que están activos en el corral | Número entero | | Sí | |
| 4.9 | Número de animales que están interaccionando con el material manipulable | Número entero | | Sí | Validar que no sea mayor que 4.8. |

---

## Pestaña/Step 5: CONDICIONES AMBIENTALES

Esta sección registra los parámetros de temperatura, humedad, gases y ventilación.

| # | Etiqueta del Campo | Tipo de Dato | Opciones / Formato | ¿Requerido? | Notas |
|:---|:---|:---|:---|:---:|:---|
| 5.1 | Fase Productiva | (Título de tabla) | N/A | N/A | Mismas fases que en pestaña 1.1. |
| | **TEMPERATURA** | | | | |
| 5.2 | ¿Dispone de sensores de temperatura? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "Sí". |
| 5.3 | ¿Están a la altura de la cabeza de los animales? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "No". |
| 5.4 | ¿Se realiza control de temperatura? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "No". |
| 5.5 | ¿Se registra la temperatura? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "No". |
| | **HUMEDAD** | | | | |
| 5.6 | ¿Dispone de sensores de humedad? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "No". |
| 5.7 | ¿Están a la altura de la cabeza de los animales? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "No". |
| 5.8 | ¿Se realiza control de humedad? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "No". |
| 5.9 | ¿Se registra la humedad? | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "No". |
| | **GASES Y VENTILACIÓN** | | | | |
| 5.10 | Indicar gases | Texto | | Sí | Ej: "NH3", "CO2". |
| 5.11 | ¿Se registran? | Selección (Sí/No) | Sí, No | Sí | |
| 5.12 | Extractores / Ventiladores | Selección (Sí/No) | Sí, No | Sí | |
| 5.13 | Apertura automática ventanas SI/NO | Selección (Sí/No) | Sí, No | Sí | Valor por defecto: "Sí". |
| 5.14 | Apertura automática chimeneas | Selección (Sí/No) | Sí, No | Sí | |
| 5.15 | Cumbreras | Selección (Sí/No) | Sí, No | Sí | |
| 5.16 | Coolings | Selección (Sí/No) | Sí, No | Sí | |
| 5.17 | Nebulización | Selección (Sí/No) | Sí, No | Sí | |
| 5.18 | Ventilación total artificial | Selección (Sí/No) | Sí, No | Sí | |
| 5.19 | Calefacción | Selección (Sí/No) | Sí, No | Sí | |
| 5.20 | Iluminación | Texto | | Sí | Ej: "Natural y artificial", "Solo artificial". |

---

## Pestaña/Step 6: PLAN DE ACCIÓN

Esta sección final se centra en la gestión de riesgos y la mejora continua.

| # | Etiqueta del Campo | Tipo de Dato | Opciones / Formato | ¿Requerido? | Notas |
|:---|:---|:---|:---|:---:|:---|
| 6.1 | Riesgos identificados | Área de texto | | Sí | Campo para listar o describir los riesgos. |
| 6.2 | Riesgos a abordar de manera inmediata | Área de texto | | Sí | |
| 6.3 | Riesgos a abordar a corto plazo | Área de texto | | Sí | |
| 6.4 | Riesgos a abordar a medio plazo | Área de texto | | Sí | |
| 6.5 | Riesgos a abordar a largo plazo | Área de texto | | Sí | |
| 6.6 | Número de asuntos/riesgos a tratar | Texto | | Sí | Ej: "2 inmediatos, 3 a corto plazo (3 meses), 2 a medio plazo (6 meses), 1 a largo plazo (1 año)". |
| 6.7 | Personas responsables | Texto | | Sí | |
| 6.8 | Indicadores de éxito | Área de texto | | Sí | Descripción de cómo se comprobará que el riesgo ha disminuido o desaparecido. |

---

## Instrucciones del Plan de Acción Original

1. Una vez identificados los riesgos, identificar los que deben abordarse de manera inmediata, a corto plazo, a medio plazo y a largo plazo.
2. Fijar una cantidad de asuntos/riesgos a tratar: por ejemplo todos los que se deben abordar de manera inmediata, tres a medio plazo (tres meses), dos a medio plazo (seis meses) y uno a largo plazo (un año).
3. Identificar las personas responsables de cada asunto y los indicadores que se utilizarán para comprobar que el riesgo ha disminuido o desaparecido.