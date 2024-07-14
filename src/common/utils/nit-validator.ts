export default function isValidNit(nit: string): boolean {
  // 0. Validar que no sea nulo o vacío
  //    Solo debe contener caracteres válidos
  //    Quitar guiones y espacios en blanco
  if (!nit) return false;

  nit = nit.toUpperCase().replace(/[-\s]/g, '');

  // Solo deben existir caracteres válidos
  const patternCharactersAllowed = /[^\dK]/;
  if (patternCharactersAllowed.test(nit)) return false;

  // 1. Validar que esté entre 2 y 12 caracteres
  //    Validar si es Consumidor Final
  if (!(nit.length >= 2 && nit.length <= 12)) return false;

  // 2. Separar la parte antes del guion y la parte después del guion, la cual será el dígito validador
  //    Obtener todos los caracteres antes del último
  const nitFirstPart = nit.slice(0, -1);
  //    Obtener último carácter
  const checkDigitStr = nit.slice(-1);

  // El último carácter solo puede ser un dígito o la letra K
  if (isNaN(parseInt(checkDigitStr)) && checkDigitStr !== 'K') {
    return false;
  }
  const checkDigitNum = checkDigitStr === 'K' ? 10 : parseInt(checkDigitStr);

  // 3. La sección antes del guion se separa en cada uno de sus dígitos.
  // 4. Se invierte el orden de los dígitos.
  const nitFirstPartInvertedArray = Array.from(nitFirstPart)
    .reverse()
    .map((x) => parseInt(x));

  // 5. Cada dígito obtenido del paso anterior se multiplica por (su posición + 1)
  for (let i = 0; i < nitFirstPartInvertedArray.length; i++) {
    nitFirstPartInvertedArray[i] *= i + 2;
  }

  // 6. Se suman todos los valores obtenidos del paso 5, llamaremos a este valor "SumaValores".
  const nitFirstPartInvertedSum = nitFirstPartInvertedArray.reduce(
    (acc, curr) => acc + curr,
    0,
  );

  // 7. La SumaValores se divide entre 11 y se truncan los decimales.
  const nitFirstPartInvertedSumDiv11 = Math.trunc(nitFirstPartInvertedSum / 11);

  // 8. El valor obtenido en el punto anterior se multiplica por 11
  const nitFirstPartInvertedSumDiv11x11 = nitFirstPartInvertedSumDiv11 * 11;

  // 9. A la “SumaValores” se le resta “SumaValores2” y a este valor le llamaremos “RestaValores”.
  const nitSubstractionFirst =
    nitFirstPartInvertedSum - nitFirstPartInvertedSumDiv11x11;

  // 10. Si la resta de valores es igual a cero el NIT es correcto.
  if (nitSubstractionFirst === 0) {
    return true;
  }

  // 11. Si RestaValores no es igual a cero, se divide entre 11 y se truncan los decimales.
  const nitSubstractionFirstDiv11 = Math.trunc(nitSubstractionFirst / 11);

  // 12. El valor obtenido en el punto 11 se multiplica por 11.
  const nitSubstractionFirstDiv11x11 = nitSubstractionFirstDiv11 * 11;

  // 13. Se resta el valor del punto 11 menos el valor obtenido en el punto 12.
  // 14. A 11 se le resta el valor obtenido en el punto 13.
  const result = 11 - (nitSubstractionFirst - nitSubstractionFirstDiv11x11);

  // 15. Se compara el dígito validador con el valor obtenido en el punto 14 y si son iguales el NIT es correcto.
  // 16. Si el valor obtenido en el punto 14 es 10, el dígito validador debe ser “K”
  return result === checkDigitNum;
}
