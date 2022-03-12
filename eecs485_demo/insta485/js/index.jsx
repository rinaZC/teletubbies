import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './post';

class Index extends React.Component {
  /* Display number of image and post owner of a single post
   */
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      next: '',
      results: [],
      url: '',
    };
    this.checkUserBehavior = this.checkUserBehavior.bind(this);
  }

  componentDidMount() {
    // This line automatically assigns this.props.url to the const variable url
    const { url } = this.props;
    const perfEntry = performance.getEntries()[0];

    // Call REST API to get the post's information
    if (this.checkUserBehavior()) {
      fetch(url, { credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
          this.setState({
            next: data.next,
            results: data.results,
            url: data.url,
          });
        })
        .catch((error) => console.log(error));
      if (perfEntry.entryType === 'navigation') {
        window.history.pushState(this.state, null);
      }
    }
  }

  checkUserBehavior() {
    const perfEntry = performance.getEntries()[0];
    if (perfEntry.entryType === 'back_forward') {
      this.setState(window.history.state);
      return false;
    }
    return true;
  }

  render() {
    const { results } = this.state;
    const { next } = this.state;

    return (
      <InfiniteScroll
        dataLength={results.length} // This important field to render the next data.
        hasMore={next}
        next={() => {
          fetch(next, { credentials: 'same-origin' })
            .then((response) => {
              if (!response.ok) throw Error(response.statusText);
              return response.json();
            })
            .then((data) => {
              this.setState((prevState) => ({
                next: data.next,
                results: prevState.results.concat(data.results),
                url: data.url,
              }));
              window.history.replaceState(this.state, null);
            })
            .catch((error) => console.log(error));
        }}
        loader={<h4>Loading...</h4>}
        endMessage={(
          <p style={{ textAlign: 'center', bottom: '0px' }}>
            <b>Yay! You have seen it all</b>
          </p>
        )}
      >
        {results.map((result) => (
          <div className="Index" key={result.postid}>
            <Post url={result.url} />
          </div>
        ))}
      </InfiniteScroll>
    );
  }
}

Index.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Index;
