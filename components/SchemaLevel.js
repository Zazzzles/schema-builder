import React, { Component } from 'react'
//import Dropdown from 'react-dropdown'
//import 'react-dropdown/style.css'
import Select from 'react-select'

import '../styles/object.css'

import AddButton from '../assets/add2.png'
import DelButton from '../assets/del.png'


const options = [
    { value: 'array', label: 'Array' },
    { value: 'integer', label: 'Integer' },
    { value: 'double', label: 'Double' },
    { value: 'number', label: 'Number' },
    { value: 'string', label: 'String' },
    { value: 'object', label: 'Object' },
    { value: 'boolean', label: 'Boolean' }
]

export default class SchemaLevel extends Component{
    constructor(props){
        super(props)
        this.state = {
            key: '',
            type: '',
        }
    }

    componentDidMount = () => {
        const { type } = this.props
        this.setState({type})
    }

    handleInputChange = (event) => {
        const { onKeyUpdate, id } = this.props
        this.setState({
            key: event.target.value
        })
        onKeyUpdate(id, event.target.value)
    }

    handleFieldAdd = () => {
        const { onAddField, id } = this.props
        console.log('adding field')
        onAddField(id)
    }

    handleSelect = (item) => {
        this.setState({type: item.value})
        const { onSetFieldType, id } = this.props
        onSetFieldType(id, item.value)
    }

    handleDelete = () => {
        const { handleFieldDelete, id } = this.props
        handleFieldDelete(id)
    }

    render(){
        //const { key } = this.state
        const { children, type, name } = this.props
        let hasChildren = children && children.length 
        let selected = options.filter(option => {
           return type === option.value
        })[0]
        return(
            <div className={`schema-level-wrapper ${hasChildren ? 'with-children' : 'without-children'}`}>
                <div className='schema-level-inner-container'>
                <div className='schema-data-container'>
                {
                    type === 'object' && 
                    <img 
                    src={AddButton} 
                    alt="Add" 
                    onClick={this.handleFieldAdd}
                    className='add-key-button'
                    />
                }
                <input className='key-input' placeholder='Key' value={name} onChange={this.handleInputChange}/>
                <Select 
                    options={options} 
                    value={selected}
                    onChange={this.handleSelect} 
                    className='select'
                />
                        <img 
                        src={DelButton} 
                        alt="Del" 
                        onClick={this.handleDelete}
                        className='delete-button'
                        />
                </div>
                  
                </div>
                {children}
            </div>
        )
    }
}