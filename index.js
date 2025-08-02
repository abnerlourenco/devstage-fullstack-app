const app = document.getElementById("app");

let users = [];

const getUser = (userData) => {
  const user = users.find(user => user.email === userData.email);
  return user;
};

const getSubscribers = (userData) => {
  const subs = users.filter(user => user.refBy === userData.ref);

  return subs.length;
};

const saveUser = (userData) => {
  const newUser = {
    ...userData,
    ref: Math.round(Math.random() * 102539 - Math.random() * 123),
    refBy: Number(new URLSearchParams(window.location.search).get('ref'))
  };

  users.push(newUser);
  console.log(users);
  return newUser;
};

const showInvite = (userData) => {
  app.innerHTML = `
    <main>
        <h3>Inscrição confirmada!</h3>

        <p>
          Convide mais pessoas e concorra a prêmios! <br/>
          Compartilhe o link e acompanhe as inscrições:
        </p>

        <div class="input-group">
          <label for="link">
            <img src="link.svg" alt="Link icon">
          </label>
          
          <input type="text" id="link" value="http://localhost:5500/?ref=${userData.ref}" 
            disabled
          >

        </div>
    </main>

    <section class="stats">
      <h4>${getSubscribers(userData)}</h4>
      <p>Inscrições feitas</p>
    </section>
  `
  app.setAttribute('class', 'page-invite');
  updateImageLinks()
};

const validateEmail = (email) => {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  return phone && phone.length >= 9;
};

const validationMessageError = (email, phone) => {
  // document.getElementsByClassName('input-group').item().focusWithin
  
  let valid = true;

  document.querySelectorAll('.input-group').forEach(group => {
    group.classList.remove('input-error');

    const errorMsg = group.querySelector('.error-message');

    if (errorMsg) errorMsg.remove();
  });

  const emailValid = validateEmail(email);
  const phoneValid = validatePhone(phone);

  if (!emailValid) {
    valid = false;
    const group = document.getElementById('email').closest('.input-group');
    group.classList.add('input-error');

    if (!group.querySelector('.error-message')) {
      const msg = document.createElement('div');
      msg.className = 'error-message';
      msg.textContent = 'insira um email valido';
      group.insertBefore(msg, group.firstChild);
    }
  }
  if (!phoneValid) {
    valid = false;
    const group = document.getElementById('phone').closest('.input-group');
    group.classList.add('input-error');
    if (!group.querySelector('.error-message')) {
      const msg = document.createElement('div');
      msg.className = 'error-message';
      msg.textContent = 'insira um telefone valido';
      group.insertBefore(msg, group.firstChild);
    }
  }

  return valid;
}

const formAction = () => {
  const form = document.getElementById('form');

  form.onsubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email').trim();
    const phone = formData.get('phone').trim();

    const isValid = validationMessageError(email, phone);

    if (!isValid) return;

    const userData = {
      email,
      phone
    };

    const user = getUser(userData);
    if (user) {
      showInvite(user);
    } else {
      const newUser = saveUser(userData);
      showInvite(newUser);
    }
  };
};

const updateImageLinks = () => {
  document.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith("http")) {
      img.src = `https://raw.githubusercontent.com/maykbrito/my-public-files/main/nlw-19/${src}`;
    }
  });
};

const startApp = () => {
  const content = `
    <main>
      <section class="about">
        <div class="section-header">
          <h2>Sobre o Evento</h2>
          <span class="badge">AO VIVO</span>
        </div>

        <p>
          Um evento feito por e para pessoas desenvolvedoras 
          apaixonadas por criar soluções inovadoras e compartilhar 
          conhecimento. Vamos mergulhar nas tendências mais recentes 
          em desenvolvimento de software, arquitetura de sistemas e 
          tecnologias emergentes, com palestras, workshops e hackathons.
          <br/><br/>
          Dias 15 a 17 de Março | Das 18h às 21h | Online & Gratuito
        </p>
      </section>
      <section class="registration">
        <h2>Inscrição</h2>

        <form id="form">
          <div class="input-wrapper">
            <div class="input-group">
              <label for="email">
                <img src="mail.svg" alt="Email icon">
              </label>
              <input type="email" id="email" name="email" placeholder="E-mail">
            </div>

            <div class="input-group">
              <label for="phone">
                <img src="phone.svg" alt="phone icon">
              </label>
              <input type="phone" id="phone" name="phone" placeholder="Telefone">
            </div>
          </div>
          <button>Confirmar
            <img src="arrow.svg" alt="Arrow right">
          </button>
        </form>
      </section>
    </main>
  `;

  app.innerHTML = content;

  fetch('./users.json')
    .then(response => response.json())
    .then(data => {
      users = data;
    })
    .catch(error => {
      app.innerHTML = `<p>Erro ao carregar usuários.</p>`;
      console.error('Erro ao carregar users.json:', error);
    });

  app.setAttribute('class', 'page-start');

  updateImageLinks();
  formAction();
};

startApp();

document.querySelector("header").onclick = () => startApp();
