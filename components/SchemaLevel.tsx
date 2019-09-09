import React from 'react'
import { Component } from 'react'
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
  { value: 'boolean', label: 'Boolean' },
]

interface state {
  key: string
  type: string
}

interface props {
  onKeyUpdate: (id: string, key: string) => void
  onAddField: (id: string) => void
  onSetFieldType: (id: string, value: string) => void
  handleFieldDelete: (id: string) => void
  id: string
  type: string
  children?: any
  name: string
}

export default class SchemaLevel extends Component<props, state> {
  constructor(props: props) {
    super(props)
    this.state = {
      key: '',
      type: '',
    }
  }

  componentDidMount = () => {
    const { type } = this.props as props
    this.setState({ type })
  }

  handleInputChange = event => {
    this.setState({
      key: event.target.value,
    })
    // onKeyUpdate(id, event.target.value)
  }

  updateKey = () => {
    const { onKeyUpdate, id } = this.props as props
    const { key } = this.state as state
    onKeyUpdate(id, key)
  }

  handleFieldAdd = () => {
    const { onAddField, id } = this.props as props
    console.log('adding field')
    onAddField(id)
  }

  handleSelect = item => {
    this.setState({ type: item.value })
    const { onSetFieldType, id } = this.props as props
    onSetFieldType(id, item.value)
  }

  handleDelete = () => {
    const { handleFieldDelete, id } = this.props as props
    handleFieldDelete(id)
  }

  render() {
    const { key } = this.state as state
    const { children, type, name } = this.props as props
    let hasChildren = children && children.length
    let selected = options.filter(option => {
      return type === option.value
    })[0]
    return (
      <div
        className={`schema-level-wrapper ${
          hasChildren ? 'with-children' : 'without-children'
        }`}
      >
        <div className='schema-level-inner-container'>
          <div className='schema-data-container'>
            {type === 'object' && (
              <img
                src={AddButton}
                alt='Add'
                onClick={this.handleFieldAdd}
                className='add-key-button'
              />
            )}
            <input
              className='key-input'
              placeholder='Key'
              value={key}
              onBlur={this.updateKey}
              onChange={this.handleInputChange}
            />
            <Select
              options={options}
              value={selected}
              onChange={this.handleSelect}
              className='select'
            />
            <img
              src={DelButton}
              alt='Del'
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
