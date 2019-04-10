const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'æ', 'ø', 'å'];
const sEnding = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'l', 'm', 'n', 'o', 'p',
  'r', 't', 'v', 'y', 'z'];
const suffixes = ['a', 'e', 'ede', 'ande', 'ende', 'ene', 'ane', 'hetene', 'en',
  'heten', 'ar', 'er', 'heter', 'as', 'es', 'edes', 'endes', 'enes', 'hetenes',
  'ens', 'hetens', 'ers', 'ets', 'et', 'het', 'ast']
  .sort((a, b) => b.length - a.length);
const replaceSuffixes = ['erte', 'ert'];
const consonantPairs = ['dt', 'vt'];
const otherSuffixes = ['leg', 'eleg', 'ig', 'eig', 'lig', 'elig', 'els', 'lov',
  'elov', 'slov', 'hetslov']
  .sort((a, b) => b.length - a.length);

let debug = false;

const stripSuffix = (R1) => {
  if (debug)
    console.log('stripSuffix');
  for (let i = 0; i < suffixes.length; i++) {
    if (R1.indexOf(suffixes[i]) > -1 &&
        R1.slice(-suffixes[i].length) === suffixes[i]) {
      return R1.slice(0, -suffixes[i].length);
    }
  }
  return R1;
};

const stripSEnding = (R1, word) => {
  if (debug)
    console.log('stripSEnding');
  if (R1[R1.length - 1] !== 's')
    return R1;
  const ending = (word + R1).slice(-3).slice(0, 2);
  if (sEnding.indexOf(ending[1]) > -1)
    return R1.slice(0, -1);
  else if (ending[1] === 'k' && vowels.indexOf(ending[0]) === -1)
    return R1.slice(0, -1);
  return R1;
};

const replaceSuffix = (R1) => {
  if (debug)
    console.log('replaceSuffix');
  for (let i = 0; i < replaceSuffixes.length; i++) {
    if (R1.indexOf(replaceSuffixes[i]) > -1 &&
        R1.indexOf(replaceSuffixes[i]) === R1.length - replaceSuffixes[i].length)
      return `${R1.slice(0, -replaceSuffixes[i].length)}er`;
  }
  return R1;
};

const stripConsonantPair = (R1) => {
  if (debug)
    console.log('stripConsonantPair');
  if (consonantPairs.indexOf(R1.slice(-2)) > -1)
    return R1.slice(0, -1);
  return R1;
};

const stripOtherSuffixes = (R1) => {
  if (debug)
    console.log('stripOtherSuffixes');
  for (let i = 0; i < otherSuffixes.length; i++) {
    if (R1.indexOf(otherSuffixes[i]) > -1 &&
        R1.slice(-otherSuffixes[i].length) === otherSuffixes[i])
      return R1.slice(0, -otherSuffixes[i].length);
  }
  return R1;
};

export const stemWord = (word, cnsls) => {
  if (word.length <= 3 || word.indexOf(' ') > -1)
    return word;
  debug = !!cnsls;
  let R1 = '';
  let vowel = false;
  for (let i = 0; i < word.length; i++){
    if (vowels.indexOf(word.charAt(i)) > -1)
      vowel = true;
    else if (vowel && vowels.indexOf(word.charAt(i)) === -1) {
      R1 = word.slice(i + 1);
      word = word.slice(0, i + 1);
      break;
    }
  }
  if (word.length < 3) {
    const newWord = word + R1.slice(0, 3 - word.length);
    R1 = R1.slice(3 - word.length);
    word = newWord;
  }
  if (R1 === '')
    return word;
  let tempR1Suffix = stripSuffix(R1);
  let tempR1SEnding = stripSEnding(R1, word);
  let tempR1Replace = replaceSuffix(R1);
  R1 = [tempR1Suffix, tempR1SEnding, tempR1Replace].sort((a, b) => a.length - b.length)[0];
  R1 = stripConsonantPair(R1);
  R1 = stripOtherSuffixes(R1);
  return word + R1;
};
