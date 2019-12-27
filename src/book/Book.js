import React, { Component } from 'react';
import './Book.css';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

class Book extends Component {


    render() {
        return (
            <div className="book-content">
                <div className="book-header">
                    <div className="book-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.book.createdBy.username}`}>
                            <Avatar className="book-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.props.book.createdBy.name)}} >
                                {this.props.book.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="book-creator-name">
                                {this.props.book.createdBy.name}
                            </span>
                            <span className="book-creator-username">
                                @{this.props.book.createdBy.username}
                            </span>
                            <span className="book-creation-date">
                                {formatDateTime(this.props.book.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <Link className = "creator-link" to={`/books/${this.props.book.id}`}>
                    <div className="book-title">
                        {this.props.book.title}
                    </div>
                    </Link>
                    <div className="book-image">
                     <img  src={this.props.book.image}   width="100%" height="100%"  />
                    </div>
                </div>
            </div>
        );
    }
}

export default Book;