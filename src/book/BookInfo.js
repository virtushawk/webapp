import React, { Component } from 'react';
import { getBookInfo } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import './BookInfo.css';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { Link } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

class BookInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: null,
            isLoading: false
        }
        this.loadBookInfo = this.loadBookInfo.bind(this);
    }

    loadBookInfo(id) {
        this.setState({
            isLoading: true
        });

      getBookInfo(id)
        .then(response => {
            this.setState({
                book: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }
      
    componentDidMount() {
        const id = this.props.match.params.id;

        this.loadBookInfo(id);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.id !== nextProps.match.params.id) {
            this.loadBookInfo(nextProps.match.params.id);
        }        
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (
            <div className="profile">
                { 
                    this.state.book ? (
                        <div className="user-profile">
                            <div className="user-title">
                            {this.state.book.title}
                            </div>
                            <div className="user-details">
                            <img className="user-image" src={this.state.book.image} ></img>
                                <div  className="user-summary">
                                    <Link className="creator-link" to={`/users/${this.state.book.createdBy.username}`}>
                                    <div className="full-name"> By {this.state.book.createdBy.name}</div>
                                    <div className="username">@{this.state.book.createdBy.username}</div>
                                    </Link>
                                </div>
                            </div>
                           
                                <SunEditor setContents={this.state.book.content} disable={true} width="100%"   >
                          </SunEditor>
                           
                        </div>  
                    ): null               
                }
            </div>
        );
    }
}

export default BookInfo;