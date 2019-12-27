import React, { Component } from 'react';
import { createBook } from '../util/APIUtils';
import './NewBook.css';  
import { Form, Input, Button, notification } from 'antd';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import storage from '../firebase-config';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

    registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const FormItem = Form.Item;
const { TextArea } = Input;
var URL = '';



class NewBook extends Component {
    constructor(props) {
        
        super(props);
        this.state = {
            Title: {
                text: ''
            },
            Content:{
               text: ''
            },
            files: [],
            uploadValue :  0,
            filesMetadata : [],
            Image:{
                text: ''
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    storageRef = storage.storage().ref();


    handleInit() {
        console.logs = []
        console.log("FilePond instance has initialised", this.pond);
      }

      handleProcessing(fieldName, file, metadata, load, error, progress, abort) {

        console.log(" handle file upload here");
        console.log(this.storageRef.child(file.name).fullPath);


        const fileUpload = file;
        
        const task = this.storageRef.child(file.name).put(fileUpload)

        task.on(`state_changed` , (snapshot) => {
            console.log(snapshot.bytesTransferred, snapshot.totalBytes)
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState({
                uploadValue:percentage
            })
        } , (error) => {
            
            this.setState({
                messag:`Upload error : ${error.message}`
            })
        } , () => {
          
            this.setState({
                messag:`Upload Success`,
                Image: task.snapshot.downloadURL,
            })
           

            this.storageRef.child(file.name).getMetadata().then((metadata) => {
                this.storageRef.child(file.name).getDownloadURL().then( url =>{
                  console.log(url);
                  URL = url;
                    alert("Done!")
          })

        }).catch(function(error) {
          console.log(error)
        });
    })

    }

    handleSubmit(event) {
        event.preventDefault();
        const BookData = {
            title: this.state.Title.text,
            content: this.state.Content.text,
            image: URL

        };


        
        createBook(BookData)
        .then(response => {
            this.props.history.push("/");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create Book.');    
            } else {
                notification.error({
                    message: 'Web App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });

    }


    validateTitle = (TitleText) => {
        if(TitleText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your Title!'
            }
        } else if (TitleText.length > 25) {
            return {
                validateStatus: 'error',
                errorMsg: `Title is too long (Maximum 25 characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleTitleChange(event) {
        const value = event.target.value;
        this.setState({
            Title: {
                text: value,
                ...this.validateTitle(value)
            }
        });
    }


    handleTextChange(content) {
        console.log(content);

        const value = content;
        this.setState({
            Content: {
                text: value,
            }
        });
    }

    isFormInvalid() {
        if(this.state.Title.validateStatus !== 'success') {
            return true;
        }
    }

    

    render() {


        return (
            <div className="new-book-container">
                <h1 className="page-title">Create Book</h1>
                <div className="new-book-content">
                    <Form onSubmit={this.handleSubmit} className="create-book-form">
                        <FormItem validateStatus={this.state.Title.validateStatus}
                            help={this.state.Title.errorMsg} className="book-form-row">
                        <TextArea 
                            placeholder="Enter your Title"
                            style = {{ fontSize: '16px' }} 
                            autosize={{ minRows: 3, maxRows: 6 }} 
                            name = "Title"
                            value = {this.state.Title.text}
                            onChange = {this.handleTitleChange} />
                        </FormItem>
                        <FormItem 
                            help={this.state.Content.errorMsg} className="book-form-row">
                           Insert Text
                        <SunEditor
                            onChange = {this.handleTextChange} />
                        </FormItem>
                        <FormItem className="Dragzone">
                            Image
                         <FilePond ref={ref => (this.pond = ref)}
                        files={this.state.files}
                        allowMultiple={false}
                        server = {{process :  this . handleProcessing . bind ( this  )}}
                        oninit={() => this.handleInit()}
                        onupdatefiles={fileItems => {
                        this.setState({
                        files: fileItems.map(fileItem => fileItem.file)
                    });
                    }}/>
                        </FormItem>
                        <FormItem className="book-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-Book-form-button">Create Book</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}

export default NewBook;
       




    

