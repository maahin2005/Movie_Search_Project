let mainDiv = document.getElementById("drop_down_Search");

let SearchIcon = document.getElementById("SearchIcon");

let xMARK = document.getElementById("xMARK");

let passTrue = true;

SearchIcon.addEventListener("click", () => {
  let searchInput = document.getElementById("searchInput").value;

  if (searchInput) {
    makeAPICall(searchInput);
  } else {
    alert("Please enter a search term.");
  }
  passTrue = false;

  let mainSearchDiv = document.getElementById("mainSearchDiv");

  mainSearchDiv.style.borderRadius = `8px`;

  displayMainDivOrNot(false);
});

async function makeAPICall(inputValue) {
  let API_KEY = "d52d540c";

  // showLoader(false);
  let BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${inputValue}`;
  try {
    let getDataByAPIKey = await fetch(BASE_URL);

    let finalData = await getDataByAPIKey.json();

    showSearches(finalData?.Search);
    // showLoader(false);
  } catch (error) {
    console.log(error);
  }
}

let delayInterval;

function getOutput(callbackFunc, delayTime) {
  if (delayInterval) {
    clearInterval(delayInterval);
    passTrue = true;
  }

  delayInterval = setTimeout(() => {
    let searchInput = document.getElementById("searchInput").value;

    callbackFunc(searchInput);
    // showLoader(true);
  }, delayTime);
}

function showSearches(dataArray) {
  let mainSearchDiv = document.getElementById("mainSearchDiv");

  mainSearchDiv.style.borderRadius = `8px`;

  xMARK.style.display = "flex";

  if (passTrue) {
    displayMainDivOrNot(true);
  }

  mainDiv.innerHTML = "";

  if (dataArray === ![] || dataArray === undefined) {
    dataArray = [{ Title: "Movie Not Found" }];
  }

  dataArray.forEach((el, index) => {
    // showLoader(false);
    if (passTrue) {
      mainSearchDiv.style.borderRadius = `8px 8px 0 0`;
    }

    if (el.Title === "Movie Not Found") {
      displayMainDivOrNot(false);
      return;
    }

    // showLoader(false);

    // console.log("el", el);

    mainDiv.style.borderRadius = `0 0 8px 8px`;
    mainDiv.innerHTML += `
        <div class="mainSearchDiv">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>${el.Title}</p>
      </div>
        `;

    let searchResultDivs = document.querySelectorAll("#drop_down_Search > div");

    searchResultDivs.forEach((el) => {
      el.addEventListener("mousemove", () => {
        let searchInput = document.getElementById("searchInput");
        let pElement = el.querySelector("p");
        searchInput.value = pElement.innerText;
      });
    });

    addEventToSearchBarResult(
      dataArray,
      searchResultDivs,
      mainDiv,
      mainSearchDiv
    );
    if (index === dataArray.length - 1) {
      let lastEle = searchResultDivs[searchResultDivs.length - 1];
      lastEle.style.borderRadius = `0 0 8px 8px`;
    }
  });

  createCards(dataArray);
}

function createCards(data, firstEle) {
  let mainCardDiv = document.getElementById("mainCardDiv");
  let mainSearchDiv = document.getElementById("mainSearchDiv");

  mainCardDiv.innerHTML = "";

  let PElement;

  if (firstEle !== undefined) {
    PElement = firstEle.querySelector("p");
  }

  let clicktResultDone;

  clicktResultDone = findFistEl(data, PElement);
  if (clicktResultDone) {
    data[0] = clicktResultDone;
  }

  let searchInput = document.getElementById("searchInput");

  if (searchInput.value == "") {
    enterValidMovieName(mainCardDiv);
    mainSearchDiv.style.borderRadius = `8px`;
    return;
  }

  data.forEach((el) => {
    if (el.Title === "Movie Not Found") {
      enterValidMovieName(mainCardDiv);

      mainSearchDiv.style.borderRadius = `8px`;

      return;
    }

    mainCardDiv.innerHTML += `  
    <div class="cardDiv">
    <img src="${el.Poster}" alt="This Movie Poster Not found" />
    </div>`;
    // <h3>${el.Title}</h3>
  });
}

function addEventToSearchBarResult(data, mainDivEvent, mainDiv, mainSearchDiv) {
  mainDivEvent.forEach((e) => {
    e.addEventListener("click", () => {
      displayMainDivOrNot(false);

      passTrue = true;

      mainSearchDiv.style.borderRadius = "8px";

      createCards(data, e);
    });
  });
}

function findFistEl(data, PElement) {
  let result;
  data.forEach((el) => {
    if (PElement && el.Title === PElement.innerText) {
      result = el;
    }
  });
  return result;
}

xMARK.addEventListener("click", () => {
  window.location.reload();
});

function displayMainDivOrNot(answer = false) {
  mainDiv.style.borderRadius = `0 0 8px 8px`;
  if (answer) {
    mainDiv.style.display = "block";
  } else {
    mainDiv.style.display = "none";
  }
}

function enterValidMovieName(mainCardDiv) {
  mainCardDiv.innerHTML = `<h1>Enter Right Spelling</h1>`;
  xMARK.style.display = "none";
}

function showLoader(isShow = false) {
  let loader = document.getElementById("loader");
  let RightSpell = document.getElementById("RightSpell");

  if (isShow) {
    loader.style.display = "block";
    RightSpell.style.display = "none";
  } else {
    loader.style.display = "none";
    RightSpell.style.display = "block";
  }
}
