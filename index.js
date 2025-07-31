const app = document.getElementById("app")

let users = []

const getUser = (userData) => {
  const user = users.find(user => user.email === userData.email)
  return user
}

const getSubscribers = (userData) => {
  const subs = users.filter(user => user.refBy === userData.ref)

  return subs.length
}

const saveUser = async (userData) => {
  const newUser = {
    ...userData,
    ref: Math.round(Math.random() * 102539 - Math.random() * 123),
    refBy: new URLSearchParams(window.location.search).get('ref')
  }

  users.push(newUser)

}

const showInvite = (userData) => {
  app.innerHTML = `
  <input type="text" id="link" value="https://evento.com/?ref=${userData.ref}" disabled>

  <div id="stats">
    <h4>${getSubscribers(userData)}</h4>
    <p>Inscrições feitas</p>
  </div>
  `
}

const formAction = () => {
  const form = document.getElementById('form')

  form.onsubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(form)

    const userData = {
      email: formData.get('email'),
      phone: formData.get('phone')
    }

    const user = getUser(userData)
    if (user) {
      showInvite(user)
    } else {
      const newUser = saveUser(userData)

      showInvite(newUser)
    }
  }
}

const startApp = () => {
  const content = `
    <form id="form">
      <input type="email" name="email" placeholder="E-mail">
      <input type="text" name="phone" placeholder="Telefone">
      <button>Confirmar</button>
    </form>
  `

  app.innerHTML = content

  fetch('./users.json')
  .then(response => response.json())
  .then(data => {
    users = data;
  })
  .catch(error => {
    app.innerHTML = `<p>Erro ao carregar usuários.</p>`;
    console.error('Erro ao carregar users.json:', error);
  });

  formAction()
}

startApp()