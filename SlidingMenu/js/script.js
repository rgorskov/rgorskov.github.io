$(document).ready(function(){
	
	var objMenu = readLS();

	var place = $('#root');
	var menu = new Menu(objMenu, place);

	menu.draw();
});

function readLS(){
	localStorage.setItem('menu', JSON.stringify(src));
	return JSON.parse(localStorage.getItem('menu'));
}


function Menu(src, place, visible){
	this.place = place;
	
	var menuItemsArr = src.map((function(item){
		return new MenuItem(item, this);
	}).bind(this));

	if(visible===undefined)
		visible=true;

	this.left = visible ? 0 : 500;

	this.ul = $('<ul/>', {
			class: 'menu-list', 
			css:{
				display: (visible ? 'block' : 'none'),
				left: this.left + 'px'
			}
			//style: (visible ? 'display: block' : 'display: none')
		}
	);
	
	this.draw = function(){
		menuItemsArr.forEach((function(item){
			item.draw(this.ul);
		}).bind(this));
		this.ul.appendTo(place);
	};

	this.hide = function(){
		this.ul.animate({'left': this.left+'px'}, 500, (function(){this.ul.hide();}).bind(this));
		
	};

	this.show = function(){
		this.ul.show();
		this.ul.animate({'left': this.left+'px'}, 500);
	};
}

function MenuItem(src, menu){
	var type = src.Type;
	var title = src.Title;
	var sub = src.Sub;

	this.draw = function(place){
		var li = $('<li/>');
		var elem;
		
		if (sub)
			elem = (new SubMenu(src, menu)).drawSpan();
		else
			elem = drawRef();
		
		elem.appendTo(li);
		li.appendTo(place);
	};

	function drawRef(){
		return $('<a>', {
			text: title, 
			href: '#', 
			class: 'menu-item',
			click: function(e){
				e.preventDefault();
			}
		});
	}

}

function SubMenu(src, parent){
	var type = src.Type;
	var title = src.Title;
	var sub = src.Sub;

	var menu = new Menu(sub, parent.place, false);
	menu.left = 500;
	menu.draw();

	var li = $('<li/>', {style: 'border-bottom: 1px solid #eee'});
	var backButton = 
		$('<span/>', {
			text: 'Назад',
			style: 'text-align: center',
			class: 'menu-item back',
			click: function(){
				menu.left = 500;
				parent.left = 0;
				menu.hide();
				parent.show();
			}
		});
	backButton.appendTo(li);
	li.prependTo(menu.ul);

	this.drawSpan = function(){
		return $('<span/>', {
			text: title,
			class: 'menu-item forward',
			click: function(){
				menu.left = 0;
				parent.left = -500;
				parent.hide();
				menu.show();
			}
		});
	};

}

var src = 
[
	{
		"Type":"Account",
		"Title":"Личный кабинет",
		"Sub":[
			{
				"Type":"ChangePassword",
				"Title":"Изменить пароль"
			},
			{
				"Type":"TwoFactor",
				"Title":"Двухфакторная аутентификация"
			},
			{
				"Type":"Binding",
				"Title":"Привязать учётную запись к стороннему сервису"
			}
		]
	},
	{
		"Type":"Institute",
		"Title":"Школа № 1",
		"Sub":[
			{
				"Type":"Employees",
				"Title":"Сотрудники"
			},
			{
				"Type":"Schedule",
				"Title":"Расписание",
				"Sub":[
					{
						"Type":"ScheduleByDepartments",
						"Title":"Расписание по классам"
					},
					{
						"Type":"ScheduleByDisciplines",
						"Title":"Расписание по предметам"
					},
					{
						"Type":"ScheduleByTeachers",
						"Title":"Расписание по учителям"
					},
					{
						"Type":"ScheduleByRooms",
						"Title":"Расписание по кабинетам"
					}
				]
			},
			{
				"Type":"Calendar",
				"Title":"Календарь Школы № 1"
			}
		]
	},
	{
		"Type":"DepartmentList",
		"Title":"Классы",
		"Sub":[
			{
				"Type":"Department",
				"Title":"1А",
				"Sub":[
					{
						"Type":"Journal",
						"Title":"Журнал"
					},
					{
						"Type":"Absences",
						"Title":"Пропуски"
					}
				]
			}
		]
	},
	{
		"Type":"Users",
		"Title":"Поиск пользователей"
	}
];
