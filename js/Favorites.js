export class GithubUser {
  static search(username){
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then( data => ({
        login: data.login,
        name: data.name,
        public_repos: data.public_repos,
        followers: data.followers
      }))
  }
}

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search('maykbrito').then(user => console.log(user))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || []

  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry =>
      entry.login !== user.login)

      this.entries = filteredEntries
      this.update()
  }
}

export class FavoritesView extends Favorites{
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector("table tbody")

    this.update()
  }

  update() {
    this.removeAllTr()

    

    this.entries.forEach( user =>{
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`

      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')

        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML =`
    
          <td class="user">
            <img src="https://github.com/paulinhoteixeira.png" alt="Imagem de paulinhoteixeira">
            <a href="https://github.com/paulinhoteixeira" target="_blank">
              <p>Paulo Teixeira</p>
              <span>paulinhoteixeira</span>
            </a>
          </td>
          <td class="repositories">54</td>
          <td class="followers">100</td>
          <td>
            <button class="remove">&times;</button>
          </td>
       
    
    `
    return tr
     
  }

  removeAllTr() {

    this.tbody.querySelectorAll("tr").forEach((tr) => {
        tr.remove()
    })
  }
}