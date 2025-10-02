// Example usage and documentation for InputField component

import React from 'react'
import InputField from './InputField'
import { Mail, Lock, User, Phone, Search, Calendar } from 'lucide-react'

export default function InputFieldExamples() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">InputField Component Examples</h1>
      
      {/* Basic Examples */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Basic Usage</h2>
        
        <div className="grid gap-6">
          {/* Simple Input */}
          <InputField
            label="Simple Input"
            placeholder="Enter some text"
            helperText="This is a basic input field"
          />
          
          {/* With Left Icon */}
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail />}
            helperText="We'll never share your email"
          />
          
          {/* With Password Toggle */}
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            leftIcon={<Lock />}
            showPasswordToggle
            helperText="Must be at least 8 characters"
          />
          
          {/* With Error */}
          <InputField
            label="Username"
            placeholder="Enter username"
            leftIcon={<User />}
            error="Username is already taken"
          />
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Size Variants</h2>
        
        <div className="space-y-4">
          <InputField
            label="Small Input"
            size="sm"
            placeholder="Small size"
            leftIcon={<Search />}
          />
          
          <InputField
            label="Medium Input (Default)"
            size="md"
            placeholder="Medium size"
            leftIcon={<Mail />}
          />
          
          <InputField
            label="Large Input"
            size="lg"
            placeholder="Large size"
            leftIcon={<User />}
          />
        </div>
      </section>

      {/* Style Variants */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Style Variants</h2>
        
        <div className="space-y-4">
          <InputField
            label="Default Style"
            variant="default"
            placeholder="Default variant"
            leftIcon={<Mail />}
          />
          
          <InputField
            label="Filled Style"
            variant="filled"
            placeholder="Filled variant"
            leftIcon={<User />}
          />
          
          <InputField
            label="Outlined Style"
            variant="outlined"
            placeholder="Outlined variant"
            leftIcon={<Phone />}
          />
        </div>
      </section>

      {/* Advanced Examples */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Advanced Usage</h2>
        
        <div className="grid gap-6">
          {/* Loading State */}
          <InputField
            label="Loading Input"
            placeholder="Processing..."
            leftIcon={<Search />}
            isLoading
            disabled
          />
          
          {/* Multiple Icons */}
          <InputField
            label="Date of Birth"
            type="date"
            leftIcon={<Calendar />}
            helperText="You must be 18 or older"
          />
          
          {/* Phone Number */}
          <InputField
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            leftIcon={<Phone />}
            helperText="Include country code"
          />
        </div>
      </section>

      {/* Responsive Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Responsive Layout</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            placeholder="John"
            leftIcon={<User />}
          />
          
          <InputField
            label="Last Name"
            placeholder="Doe"
            leftIcon={<User />}
          />
          
          <InputField
            label="Email"
            type="email"
            placeholder="john@example.com"
            leftIcon={<Mail />}
            className="md:col-span-2"
          />
        </div>
      </section>
    </div>
  )
}

/*
Usage Examples:

1. Basic Input:
<InputField
  label="Email"
  type="email"
  placeholder="Enter email"
  leftIcon={<Mail />}
/>

2. Password with Toggle:
<InputField
  label="Password"
  type="password"
  showPasswordToggle
  leftIcon={<Lock />}
/>

3. With React Hook Form:
<InputField
  {...register('email')}
  label="Email"
  type="email"
  leftIcon={<Mail />}
  error={errors.email?.message}
/>

4. Loading State:
<InputField
  label="Search"
  isLoading
  disabled
  leftIcon={<Search />}
/>

5. Different Sizes:
<InputField size="sm" />
<InputField size="md" />
<InputField size="lg" />

6. Style Variants:
<InputField variant="default" />
<InputField variant="filled" />
<InputField variant="outlined" />
*/
