const showPeopleBtn = document.querySelector('#show-people');
const hidePeopleBtn = document.querySelector('#hide-people');
const filmId = document.querySelector('#filmId');

// Виводимо інформацію про персонажів 5 епізоду
async function getPersonsInfo() {
  const charactersArr = await axios.get(`https://swapi.dev/api/films/${filmId.value}/`);
  const personsLink = charactersArr.data.characters.map((link) => {
    const correctlink = link.replace('http', 'https');
    return correctlink;
  });

  const personsInfo = personsLink.map((link) => {
    return axios.get(link).then((res) => {
      return {
        name: res.data.name,
        birthday: res.data.birth_year,
        male: res.data.gender
      };
    });
  });

  return Promise.all(personsInfo);
}

async function displayPersonsInfo(info) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('person-wrapper');
  const prevoiusInfo = document.querySelector('.person-wrapper');
  if (prevoiusInfo) {
    prevoiusInfo.remove();
  }

  await info.forEach(async (person) => {
    const obj = await person;
    const infoBlock = document.createElement('div');
    const name = document.createElement('h2');
    const birthday = document.createElement('h5');
    const male = document.createElement('h5');

    name.innerText = obj.name;
    birthday.innerText = 'Was born: ' + obj.birthday;
    male.innerText = 'Male: ' + obj.male;

    infoBlock.classList.add('infoBlock');
    wrapper.append(infoBlock);
    infoBlock.append(name, birthday, male);
  });
  document.body.append(wrapper);
}

// Ховаємо інформацію про персонажів
function hidePersonsInfo() {
  const info = document.querySelector('.person-wrapper');
  if (!info) {
    return;
  }
  info.remove();
}

showPeopleBtn.addEventListener('click', async () => {
  try {
    const personsInfo = await getPersonsInfo();
    displayPersonsInfo(personsInfo);
  } catch (error) {
    alert('Enter correct number of film (1-6)');
  }

});

hidePeopleBtn.addEventListener('click', hidePersonsInfo);

// Дістаєм інформацію по планетах
const showPlanetBtn = document.querySelector('#show-planet');
const hidePlanetBtn = document.querySelector('#hide-planet');

const nextBtn = document.createElement('button');
nextBtn.classList.add('next-planets-btn');
nextBtn.innerText = 'Next';

async function getPlanetsInfo(page = 'https://swapi.dev/api/planets/') {
  currentPage = 'https://swapi.dev/api/planets/';
  const planetInfo = await axios.get(page);
  const planetsDataArr = await planetInfo.data.results;
  const planetsNameList = planetsDataArr.map((planet) => planet.name);
  const previousBlock = document.querySelector('.planet-info-block');
  if (previousBlock) {
    previousBlock.remove();
  }

  const infoBlock = document.createElement('div');
  infoBlock.classList.add('planet-info-block');
  const infolist = document.createElement('ul');
  document.body.append(infoBlock);
  infoBlock.append(infolist);
  infoBlock.append(nextBtn);

  planetsNameList.forEach((element) => {
    const name = document.createElement('li');
    name.innerText = element;
    infolist.append(name);
  });
}

//Ховаєм планети
function hidePlanetsInfo() {
  const info = document.querySelector('.planet-info-block');
  if (!info) return;
  info.remove();
  currentPage = 'https://swapi.dev/api/planets/';
}

showPlanetBtn.addEventListener('click', () => {
  getPlanetsInfo();
});
hidePlanetBtn.addEventListener('click', hidePlanetsInfo);

// Кнопка з наступною сторінкою планет
let currentPage = 'https://swapi.dev/api/planets/';
nextBtn.addEventListener('click', async () => {
  const page = await axios.get(currentPage);
  const nextPage = await page.data.next;
  if (nextPage) {
    nextPage.replace('http', 'https');
    getPlanetsInfo(nextPage);
    currentPage = nextPage;
  } else {
    nextBtn.outerHTML = '<h2>This is the end of the list of planets</h2>';
  }
});
