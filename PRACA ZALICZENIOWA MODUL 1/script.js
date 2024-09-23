import { rowData } from "./data.js";

// HEADER - NAV BAR
const root = document.documentElement;

const header = document.createElement("header");
const nav = document.createElement("nav");
const darkButton = document.createElement("button");
const lightButton = document.createElement("button");
const navText = document.createElement("span");
const navDivButtons = document.createElement("div");

navDivButtons.id = "nav-div-buttons";
nav.id = "nav-container";
navText.textContent = "Type Starwars to hear the music.";
darkButton.textContent = "White";
lightButton.textContent = "Yellow";

document.body.appendChild(header);
header.appendChild(nav);
nav.appendChild(navText);
nav.appendChild(navDivButtons);
navDivButtons.appendChild(darkButton);
navDivButtons.appendChild(lightButton);

//BUTTONY OD ZMIANY STYLU STRONY

darkButton.addEventListener("click", () => {
	root.style.setProperty("--yellow", "white");
});

lightButton.addEventListener("click", () => {
	root.style.setProperty("--yellow", "rgb(236, 221, 40)");
});

// MAIN

const main = document.createElement("main");

// MIDDLE BUTTONS

const mainDivButtons = document.createElement("div");

mainDivButtons.id = "main-div-buttons";

document.body.appendChild(main);
main.appendChild(mainDivButtons);

// LOGO

const logo = document.createElement("img");
logo.id = "logo";
logo.src = "./img/logo.png";
logo.alt = "Logo Star Wars";

main.appendChild(logo);

// TWORZENIE DIVA W KTORYM ZNAJDUJA SIE  2 SEARCH INDPUTY

const searchDiv = document.createElement("div");
searchDiv.id = "main-div-inputs";

const searchIdDiv = document.createElement("div");
const searchTextDiv = document.createElement("div");
searchIdDiv.id = "searchIdDiv";
searchTextDiv.id = "searchTextDiv";

const searchIndexSpan = document.createElement("span");
const searchTextSpan = document.createElement("span");

searchIndexSpan.textContent = "Search by index";
searchTextSpan.textContent = "Search by text";

const searchIdInput = document.createElement("input");
searchIdInput.id = "searchId";
const searchTextInput = document.createElement("input");
searchTextInput.id = "searchText";

//NASLUCHIWACZ ODPOWIADAJACY ZA MUZYKE

let typedText = "";

document.addEventListener("keydown", (event) => {
	const keyName = event.key;

	if (keyName.length === 1) {
		typedText += keyName.toLowerCase();
	}
	if (typedText.includes("starwars")) {
		const source = document.createElement("audio");
		source.setAttribute("src", "song.mp3");
		source.setAttribute("preload", "auto");
		source.play();

		typedText = "";
	}
});

//FUNKCJA GENERUJACA INPUTY

function generateSearchInputs() {
	if (searchDiv) {
		searchDiv.remove();
	}
	main.appendChild(searchDiv);
	searchDiv.appendChild(searchIdDiv);
	searchDiv.appendChild(searchTextDiv);
	searchIdDiv.appendChild(searchIndexSpan);
	searchIdDiv.appendChild(searchIdInput);
	searchTextDiv.appendChild(searchTextSpan);
	searchTextDiv.appendChild(searchTextInput);
}

//TWORZENIE THEAD

let table;

function createHeader() {
	const existingTableDiv = document.getElementById("table-div");
	if (existingTableDiv) {
		existingTableDiv.remove();
	}
	if (table) {
		table.remove();
	}

	table = document.createElement("table");
	table.id = "main-table";
	const thead = document.createElement("thead");
	const trhead = document.createElement("tr");
	const tableDiv = document.createElement("div");
	tableDiv.id = "table-div";
	trhead.id = "trhead";

	main.appendChild(tableDiv);
	tableDiv.appendChild(table);
	table.appendChild(thead);
	thead.appendChild(trhead);

	return trhead;
}

//FUNCKJA TWORZACA PRZYCISKI NA PODSTAWIE POBRANYCH KLUCZY Z DATA.JS

function generateMainButtons(obj) {
	const mainContainer = document.getElementById("main-div-buttons");
	const keys = Object.keys(obj);

	keys.forEach((key) => {
		const button = document.createElement("button");
		button.innerText = key;
		button.value = obj[key];

		button.addEventListener("click", () => {
			const selectRemoveButton = document.getElementById(
				"delete-selected-button"
			);
			if (selectRemoveButton) {
				selectRemoveButton.remove();
			}
			if (logo) {
				logo.remove();
			}

			generateSearchInputs();
			handleButtonClick(key);

			if (key === "films") {
				const searchTextInput = document.getElementById("searchText");
				searchTextInput.placeholder = "Search by title";
				return;
			}
		});
		mainContainer.appendChild(button);
	});
}

generateMainButtons(rowData);

//FUNCKJA KTORA JEST ODPOWIEDZIALNA ZA KLIKNIECIE W DANY BUTTON

function handleButtonClick(buttonKey) {
	// FUNCKCJA GENERUJACA NAGLOWKI

	function generateHeaders(obj) {
		obj.forEach((item) => {
			const th = document.createElement("th");
			const tr = document.getElementById("trhead");
			th.textContent = item.toUpperCase();

			tr.appendChild(th);
		});
	}

	let allRows = [];
	let currentPage = 1;
	let itemsPerPage = 10;

	// FUNKCJA GENERUJACA TABELE

	function generateTable(obj, itemList) {
		const table = document.querySelector("table");
		const searchTextInput = document.getElementById("searchText");
		let existingTbody = document.querySelector("tbody");

		if (itemList === "films") {
			searchTextInput.placeholder = "Search by title";
		} else {
			searchTextInput.placeholder = "Search by name";
		}

		if (existingTbody) {
			table.removeChild(existingTbody);
		}

		const tbody = document.createElement("tbody");
		const deleteSelectedButton = document.createElement("button");
		deleteSelectedButton.textContent = "Remove All";
		deleteSelectedButton.id = "delete-selected-button";
		table.appendChild(tbody);

		obj.forEach((item, rowIndex) => {
			const tr = document.createElement("tr");

			itemList.forEach(({ value }) => {
				const td = document.createElement("td");
				if (value === "id") {
					td.textContent = rowIndex + 1;
					td.id = `row-${rowIndex + 1}`;
				} else if (value === "name") {
					td.id = `name-${rowIndex + 1}`;
					td.textContent = item[value];
				} else if (value === "created") {
					td.textContent = item[value].slice(0, 10);
					tr.appendChild(td);
				} else if (value === "actions") {
					const actionDiv = document.createElement("div");
					actionDiv.id = "action-div";
					const deleteButton = document.createElement("button");
					deleteButton.id = "deletebtn";
					deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

					deleteButton.addEventListener("click", () => {
						tbody.removeChild(tr);

						allRows = allRows.filter((r) => r !== tr);

						const visibleRows = allRows.filter(
							(row) => row.style.display !== "none"
						);

						if (visibleRows.length < 1) {
							if (currentPage > 1) {
								currentPage--;
							}
						}

						paginateRows(currentPage, itemsPerPage);
					});

					const detailButton = document.createElement("button");
					detailButton.id = "detailbtn";
					detailButton.innerHTML = '<i class="fa-solid fa-circle-info"></i>';

					detailButton.addEventListener("click", () => {
						const newWindow = document.createElement("div");

						newWindow.className = "detail-window";
						newWindow.id = "newwindow";

						const detailContent = document.createElement("div");
						const detailThead = document.createElement("thead");
						const detailTbody = document.createElement("tbody");
						const detailTable = document.createElement("table");
						const detailTr = document.createElement("tr");
						const detailThKeys = document.createElement("th");
						const detailThValue = document.createElement("th");

						detailThKeys.textContent = "KEY";
						detailThValue.textContent = "VALUE";
						detailContent.appendChild(detailTable);
						detailTable.appendChild(detailThead);
						detailTable.appendChild(detailTbody);
						detailThead.appendChild(detailTr);
						detailTr.appendChild(detailThKeys);
						detailTr.appendChild(detailThValue);

						for (const key in item) {
							if (item.hasOwnProperty(key)) {
								const detailTr = document.createElement("tr");
								const tdKey = document.createElement("td");
								const tdValue = document.createElement("td");

								tdKey.innerHTML = key;
								tdValue.innerHTML = item[key];

								detailTbody.appendChild(detailTr);
								detailTr.appendChild(tdKey);
								detailTr.appendChild(tdValue);
							}
						}

						const closeButton = document.createElement("button");
						closeButton.textContent = "Close";
						closeButton.addEventListener("click", () => {
							document.body.removeChild(newWindow);
						});

						newWindow.appendChild(closeButton);
						newWindow.appendChild(detailContent);

						document.body.appendChild(newWindow);
					});

					const checkbox = document.createElement("input");
					checkbox.setAttribute("type", "checkbox");
					checkbox.classList.add("row-checkbox");
					checkbox.addEventListener("change", () => {
						if (checkbox.checked) {
							const mainDivInputs = document.getElementById("main-div-inputs");
							mainDivInputs.appendChild(deleteSelectedButton);
							tr.style.backgroundColor = "rgba(133, 133, 133, 0.6)";
						} else {
							tr.style.backgroundColor = "";

							const anyChecked =
								document.querySelectorAll(".row-checkbox:checked").length > 0;

							if (!anyChecked) {
								deleteSelectedButton.remove();
							}
						}
					});

					actionDiv.appendChild(deleteButton);
					actionDiv.appendChild(detailButton);
					actionDiv.appendChild(checkbox);

					td.appendChild(actionDiv);
				} else {
					td.textContent = item[value];
				}
				tr.appendChild(td);
			});

			tbody.appendChild(tr);
		});
		allRows = Array.from(tbody.querySelectorAll("tr"));
		paginateRows(currentPage, itemsPerPage);

		deleteSelectedButton.addEventListener("click", () => {
			const checkboxes = document.querySelectorAll(".row-checkbox:checked");
			const deleteButton = document.getElementById("delete-selected-button");
			checkboxes.forEach((checkbox) => {
				const row = checkbox.closest("tr");
				tbody.removeChild(row);

				allRows = allRows.filter((r) => r !== row);
			});
			const visibleRows = allRows.filter((row) => row.style.display !== "none");
			if (visibleRows.length < 1) {
				const totalPages = Math.ceil(allRows.length / itemsPerPage);
				if (currentPage > 1) {
					currentPage--;
				}
			}

			paginateRows(currentPage, itemsPerPage);
			deleteButton.remove();
		});
	}
	function paginateRows(page, itemsPerPage) {
		if (!allRows.length) return;

		const totalPages = Math.ceil(allRows.length / itemsPerPage);
		currentPage = Math.min(page, totalPages);

		allRows.forEach((row) => {
			row.style.display = "none";
		});

		// Wylicz indeksy początku i końca dla bieżącej strony
		const start = (page - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const paginatedRows = allRows.slice(start, end);

		// Pokaż tylko wiersze bieżącej strony
		paginatedRows.forEach((row) => {
			row.style.display = "";
		});

		// Zaktualizuj stopkę z paginacją
		createFooter(allRows.length, itemsPerPage, page);
	}

	function createFooter(totalRows, itemsPerPage, currentPage) {
		const existingFooter = document.querySelector("footer");
		if (existingFooter) {
			existingFooter.remove();
		}

		const footer = document.createElement("footer");
		const divPagination = document.createElement("div");
		divPagination.id = "page-container";

		const leftArrowButton = document.createElement("button");
		leftArrowButton.id = "prev-btn";
		leftArrowButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

		const rightArrowButton = document.createElement("button");
		rightArrowButton.id = "next-btn";
		rightArrowButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';

		const spanPagination = document.createElement("span");
		const totalPages = Math.ceil(totalRows / itemsPerPage);
		spanPagination.textContent = `of ${totalPages}`;

		const inputSelectAmount = document.createElement("select");
		inputSelectAmount.id = "items-per-page";

		const option1 = document.createElement("option");
		option1.setAttribute("value", "10");
		option1.textContent = "10";
		const option2 = document.createElement("option");
		option2.setAttribute("value", "20");
		option2.textContent = "20";

		inputSelectAmount.appendChild(option1);
		inputSelectAmount.appendChild(option2);

		inputSelectAmount.value = itemsPerPage;

		const pageInput = document.createElement("input");
		pageInput.type = "number";
		pageInput.id = "page-input";
		pageInput.min = "1";
		pageInput.max = totalPages;
		pageInput.placeholder = `${currentPage}`;
		pageInput.step = "1";

		inputSelectAmount.addEventListener("change", (event) => {
			itemsPerPage = parseInt(event.target.value, 10);
			currentPage = 1;
			paginateRows(currentPage, itemsPerPage);
		});

		pageInput.addEventListener("input", (event) => {
			const inputPage = parseInt(event.target.value, 10);
			if (inputPage > 0 && inputPage <= Math.ceil(totalRows / itemsPerPage)) {
				currentPage = inputPage;
				paginateRows(currentPage, itemsPerPage);
			} else if (event.target.value === "") {
				paginateRows(currentPage, itemsPerPage);
			}
			pageInput.placeholder = `${currentPage}`;
		});

		document.body.appendChild(footer);
		footer.appendChild(divPagination);
		divPagination.appendChild(leftArrowButton);
		divPagination.appendChild(pageInput);
		divPagination.appendChild(spanPagination);
		divPagination.appendChild(rightArrowButton);
		divPagination.appendChild(inputSelectAmount);

		leftArrowButton.addEventListener("click", () => {
			if (currentPage > 1) {
				currentPage--;
				paginateRows(currentPage, itemsPerPage);
			}
		});

		rightArrowButton.addEventListener("click", () => {
			if (currentPage < Math.ceil(totalRows / itemsPerPage)) {
				currentPage++;
				paginateRows(currentPage, itemsPerPage);
			}
		});

		leftArrowButton.disabled = currentPage === 1;
		rightArrowButton.disabled =
			currentPage === Math.ceil(totalRows / itemsPerPage);

		searchIdInput.addEventListener("input", (e) => {
			const rows = document.querySelectorAll("tbody tr");
			const value = e.target.value;
			if (!/^\d*$/.test(value)) {
				e.target.value = value.replace(/\D/g, "");
				return;
			}

			if (value === "") {
				paginateRows(currentPage, itemsPerPage);
				return;
			}
			rows.forEach((row) => {
				const idCell = row.querySelector("td:first-child");
				if (idCell && (idCell.textContent === value || value === "")) {
					row.style.display = "";
				} else {
					row.style.display = "none";
				}
			});
		});

		searchTextInput.addEventListener("input", (e) => {
			const rows = document.querySelectorAll("tbody tr");
			const value = e.target.value.toLowerCase();
			rows.forEach((row) => {
				const names = row.children[1];

				if (value === "") {
					paginateRows(currentPage, itemsPerPage);
					return;
				}
				if (names.textContent.toLowerCase().includes(value) || value === "") {
					row.style.display = "";
				} else {
					row.style.display = "none";
				}
			});
		});
		function inputPlaceHolder() {
			const searchIdInput = document.getElementById("searchId");
			searchIdInput.placeholder = `1 from ${allRows.length}`;
			return;
		}

		inputPlaceHolder();
	}

	//

	let header = [];
	let tables = [];

	switch (buttonKey) {
		case "vehicles":
			header = ["id", "name", "model", "class", "created", "actions"];
			tables = [
				{ value: "id" },
				{ value: "name" },
				{ value: "model" },
				{ value: "vehicle_class" },
				{ value: "created" },
				{ value: "actions" },
			];
			createHeader();
			generateHeaders(header);
			generateTable(rowData.vehicles, tables);
			break;
		case "starships":
			header = ["id", "name", "model", "manufacturer", "created", "actions"];
			tables = [
				{ value: "id" },
				{ value: "name" },
				{ value: "model" },
				{ value: "manufacturer" },
				{ value: "created" },
				{ value: "actions" },
			];
			createHeader();
			generateHeaders(header);
			generateTable(rowData.starships, tables);
			break;
		case "species":
			header = [
				"id",
				"name",
				"classification",
				"designation",
				"created",
				"actions",
			];
			tables = [
				{ value: "id" },
				{ value: "name" },
				{ value: "classification" },
				{ value: "designation" },
				{ value: "created" },
				{ value: "actions" },
			];
			createHeader();
			generateHeaders(header);
			generateTable(rowData.species, tables);
			break;
		case "planets":
			header = [
				"id",
				"name",
				"rotation period",
				"orbital period",
				"created",
				"actions",
			];
			tables = [
				{ value: "id" },
				{ value: "name" },
				{ value: "rotation_period" },
				{ value: "orbital_period" },
				{ value: "created" },
				{ value: "actions" },
			];
			createHeader();
			generateHeaders(header);
			generateTable(rowData.planets, tables);
			break;
		case "people":
			header = ["id", "name", "height", "mass", "created", "actions"];
			tables = [
				{ value: "id" },
				{ value: "name" },
				{ value: "height" },
				{ value: "mass" },
				{ value: "created" },
				{ value: "actions" },
			];
			createHeader();
			generateHeaders(header);
			generateTable(rowData.people, tables);
			break;
		case "films":
			header = [
				"id",
				"title",
				"episode id",
				"opening crawl",
				"created",
				"actions",
			];
			tables = [
				{ value: "id" },
				{ value: "title" },
				{ value: "episode_id" },
				{ value: "opening_crawl" },
				{ value: "created" },
				{ value: "actions" },
			];
			createHeader();
			generateTable(rowData.films, tables);
			generateHeaders(header);
			break;
		default:
			return;
	}
}
