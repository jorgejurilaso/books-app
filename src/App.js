import { Component } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
class App extends Component {
  constructor(props) {

    super(props);
    this.state = {
      input: '',
      isFound: false,
      requestError: false,
      isLoading: false,
      items: [],
      list: [],
      count: 0,
      isSubmitted: false
    };

  }

  handleSubmit = (e) => {
    e.preventDefault();
    let input = this.state.input;
    if (this.state.list.indexOf(input) === -1 && this.state.list.length < 8 && e.type === 'submit') { this.setState({ list: [...this.state.list, input] }) }
    if (this.state.list.indexOf(input) === -1 && this.state.list.length >= 8 && e.type === 'submit') {
      const data = this.state.list;
      let myCount = this.state.count;
      data[myCount] = input;
      this.setState({ list: data, count: myCount + 1, isSubmitted: true })
    }
    if (this.state.count === 8) { this.setState({ count: 0 }) }


    this.setState({ isLoading: true });
    const promise = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${this.state.input}`);
    promise
      .then((response) => {
        if (response.data.items.length > 0) { this.setState({ items: response.data.items, isFound: true, isLoading: false }) } else { this.setState({ items: [], isFound: false, isLoading: false }) }
      })
      .catch((error) => {
        // Request failed
        this.setState({ requestError: true, items: [], isFound: false, isLoading: false });
      });
  }

  handleClick = () => {
    this.setState({ isLoading: true, isSubmitted: false });

    const promise = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${this.state.input}`);
    promise
      .then((response) => {
        if (response.data.items.length > 0) { this.setState({ items: response.data.items, isFound: true, isLoading: false }) } else { this.setState({ items: [], isFound: false, isLoading: false, isSubmitted: false }) }
      })
      .catch((error) => {
        // Request failed
        this.setState({ requestError: true, items: [], isFound: false, isLoading: false });
      });
  }

  handleChange = (e) => {
    this.setState({ input: e.target.value })
    this.setState({ isLoading: true });

    //console.log("e.target.value "+e.target.value)

    const promise = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${e.target.value}`);
    promise
      .then((response) => {
        if (response.data.items.length > 0) { this.setState({ items: response.data.items, isFound: true, isLoading: false }) } else { this.setState({ items: [], isFound: false, isLoading: false, isSubmitted: false }) }
      })
      .catch((error) => {
        this.setState({ requestError: true, items: [], isFound: false, isLoading: false });
      });
    this.setState({ isSubmitted: false })
  }


  componentDidMount() {
    this.setState({ input: "harry potter" })
    this.setState({ isLoading: true });
    const promise = axios.get(`https://www.googleapis.com/books/v1/volumes?q=$harry%20potter`);
    promise
      .then((response) => {
        //console.log('inside of promise response.data.items', response.data.items);
        if (response.data.items.length > 0) { this.setState({ items: response.data.items, isFound: true, isLoading: false }) } else { this.setState({ items: [], isFound: false, isLoading: false }) }
      })
      .catch((error) => {
        this.setState({ requestError: true, items: [], isFound: false, isLoading: false });
      });
  }
  render() {
    const { items, list } = this.state;

    this.state.requestError && (
      <p style={{ color: 'red' }}>Something went wrong!</p>
    )


    return (
      <div className="App">
        <h1> Book Search</h1>
        <form onSubmit={this.handleSubmit}>
          <div id="search">
            <input
              placeholder="harry potter"
              value={this.state.input}
              onChange={this.handleChange}
            />


            <button onClick={this.handleClick}>Search</button>

            <button type="submit"  >Add</button>
          </div>

          <div id="listSaveBook">
            <table>
              <tr>
                {list && list.map(element =>
                  <th key={element} >{element}</th>
                )}
              </tr>
            </table>
          </div>

          <div id="listBook">
            <table>
              <caption>
                {
                  (this.state.items.length === 0) && (
                    <p style={{ color: 'red' }}>No books found for {this.state.input} </p>
                  )
                }
                {
                  (this.state.items.length > 0) && (
                    <p style={{ color: 'Blue' }}>My Results for  {this.state.input + " "}
                      {this.state.isLoading && (
                        <FontAwesomeIcon icon={faSpinner} spin size="1x" color="#ffffff" />
                      )}
                    </p>
                  )
                }

              </caption>
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Categories</th>
                </tr>
              </thead>
              <tbody>

                {items && items.map(item =>
                  <tr key={item.id + item.etag}>
                    <td><img style={{ width: 140 }} alt={item.volumeInfo.title} src={item.volumeInfo.imageLinks !== undefined ? item.volumeInfo.imageLinks.thumbnail : 'http://examgurubooks.com/images/data_not.png'} ></img></td>
                    <td> <em > <a href={item.volumeInfo.infoLink} >{item.volumeInfo.title}  </a> </em>    </td>
                    <td>{item.volumeInfo.description} </td>
                    <td>{item.volumeInfo.categories} </td>
                  </tr>)
                }

              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
        </form>


      </div>
    );
  }
}

export default App;
