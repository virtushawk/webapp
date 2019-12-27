import React, { Component } from 'react';
import { getAllBooks, getUserCreatedBooks} from '../util/APIUtils';
import Book from './Book';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon } from 'antd';
import { BOOK_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './BookList.css';

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadBookList = this.loadBookList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadBookList(page = 0, size = BOOK_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_BOOKS') {
                promise = getUserCreatedBooks(this.props.username, page, size);
        }
        else if (this.props.type === 'USER_VOTED_BOOKS'){

        } 
    }
         else {
            promise = getAllBooks(page, size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const books = this.state.books.slice();
            this.setState({
                books: books.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }   


    componentDidMount() {
        this.loadBookList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                books: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });    
            this.loadBookList();
        }
    }

    handleLoadMore() {
        this.loadBookList(this.state.page + 1);
    }



    render() {
        const bookViews = [];
        this.state.books.forEach((book) => {
            bookViews.push(<Book 
                key={book.id} 
                book={book}
                />)        
        });

        return (
            <div className="books-container">
                {bookViews}
                {
                    !this.state.isLoading && this.state.books.length === 0 ? (
                        <div className="no-books-found">
                            <span>No Books Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-books"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default withRouter(BookList);