'use strict';
// ~toggle navbar menu
document.getElementById("toggle-nav").addEventListener('click', function() {
  this.classList.toggle('active');
});

// ~toggle second paragraph in about section
let p = document.getElementById('about-p');

window.innerWidth <= 767 ? p.classList.add('hide') : null;

document.getElementById("about-more").addEventListener('click', _ => p.classList.toggle('hide'));

// ~Handle cards in portfolio section
let cardsCont = document.getElementById('portCards');
let cardsType = document.querySelectorAll("#portfolio .portfolio-content .taps [data-type]");
onload = generatePortCards('all', true);

cardsType.forEach((v, k, p) => {
  v.addEventListener('click', (item) => {
    for (let i = 0; i < p.length; i++) {
      p[i].classList.contains('active') ? p[i].classList.remove('active') : null;
    }
    item.target.classList.add('active');
    Array.from(cardsCont.children).forEach(v => v.style.animation = 'hideCards 1.2s ease-in-out')
    window.setTimeout(() => generatePortCards(item.target.getAttribute('data-type')), 800);
  })
});

function generatePortCards(type = 'all', onLoad = false) {
  fetch("./script/port_cards.json").then(r => r.json()).then(data => {
    cardsCont.innerHTML = '';
    let selected;
    // *Check the chosen type and store its cards in selected variable
    if (type == 'all') {
      selected = data
    } else {
      selected = [];
      data.forEach(v => v.type == type ? selected.push(v) : null);
    }

    // *Create the cards and add them to the html file
    for (let i = 0; i < selected.length; i++) {
      let div = document.createElement('div');
      div.classList.add('card');
      div.style.backgroundImage = `url(${selected[i].img})`;
      !onLoad ? div.style.animation = 'showCards 1.2s ease-in-out' : null;
      // *show only 4 cards in small screen sizes
      selected.length > 4 && i > 3 ? div.classList.add('sm-none') : null;
      cardsCont.appendChild(div);
    }
  });
};

// ~Handle testimonial cards
let testCont = document.getElementById('testCont');
let testTaps = document.getElementById('testTaps');

function generateTestimonials() {
  onload = _ => window.innerWidth <= 767 ? buildCard([0]) : buildCard([0, 1]);
  console.log(testTaps);
  Array.from(testTaps.children).forEach((e, i, arr) => e.addEventListener('click', _ => {
    if (!e.classList.contains('active')) {
      arr.forEach(tap => tap.classList.remove('active'));
      e.classList.add('active');
      // let cardsIds = i == 0 ? [0, 1] : i == 1 ? [2, 3] : [4, 5];
      //& Another way to do the same as last line is: \/
      //? let cardsIds = e.getAttribute('value').split(',')
      let v = e.getAttribute('value');
      let cardsIds = window.innerWidth <= 767 ? cardsIds.push(v) : cardsIds.push(v.split(','));
      console.log(cardsIds);
      Array.from(testCont.children).forEach(child => child.style.animation = 'hideToLeft 1.2s ease-in-out');
      setTimeout(_ => buildCard(cardsIds), 1000);
    }
  }))

  function genTaps(num=0) {
    if (window.innerWidth <= 767) {
      for (let i = 0; i < num; i++) {
        let li = document.createElement('li');
        li.setAttribute('value', i);
        i == 0 ? li.classList.add('active') : null;
        testTaps.appendChild(li);
      }
    } else {
      for (let i = 0; i < num; i+2) {
        let li = document.createElement('li');
        li.setAttribute('value', `${i},${i+1}`);
        i == 0 ? li.classList.add('active') : null;
        testTaps.appendChild(li);
      }
    }
  }

  function buildCard(cardsId) {
    fetch('./script/testimonials.json').then(r => r.json()).then(data => {
      testCont.innerHTML = '';
      for (const id of cardsId) {
        testCont.appendChild(p(data[id]));
      }
      genTaps(data.length);
      console.log(data.length);
    });
    var p = card => {
      let container = document.createElement('div');
      container.classList.add('card');
      
      let top = document.createElement('div');
      top.classList.add('top');

      let imgDiv = document.createElement('div');
      imgDiv.classList.add('img');
      imgDiv.style.backgroundImage = 'url(' + card.img + ')';

      let textDiv = document.createElement('div');
      textDiv.classList.add('text');

      let name = document.createElement('div');
      name.classList.add('name');
      name.textContent = card.name;

      let position = document.createElement('div');
      position.classList.add('sub-desc');
      position.textContent = card.position

      let breakLine = document.createElement('div');
      breakLine.classList.add('line-break');

      let socialCont = undefined;

      if (card.social) {
        socialCont = document.createElement('div');
        socialCont.classList.add('social');

        for (const k in card.social) {
          if (card.social.hasOwnProperty(k)) {
            let a = document.createElement('a');
            a.href = card.social[k];

            let i = document.createElement('i');
            i.classList.add('fa-brands', `fa-${k}`);

            a.appendChild(i);
            socialCont.appendChild(a);
          }
        }
      }

      let bottom = document.createElement('p');
      bottom.classList.add('bottom');
      bottom.textContent = card.opinion;

      textDiv.appendChild(name);
      textDiv.appendChild(position);
      top.appendChild(imgDiv);
      top.appendChild(textDiv);
      top.appendChild(breakLine);
      socialCont != undefined ? top.appendChild(socialCont) : null;
      container.appendChild(top);
      container.appendChild(bottom);

      container.style.animation = 'showFromRight 1.2s ease-in-out';

      return container;
    }
  }
}

generateTestimonials();
