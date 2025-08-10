import React from 'react'
import Link from 'next/link'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  fullWidth = false,
  ...props
}) => {
  // Base styles with modern hover effects
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 overflow-hidden group'

  // Variant styles with advanced hover effects
  const variantStyles = {
    primary:
      'bg-Teal text-white shadow-md hover:bg-DarkTeal hover:shadow-lg focus:ring-Teal before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]',
    secondary:
      'bg-gray-600 text-white shadow-md hover:bg-gray-700 hover:shadow-lg focus:ring-gray-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]',
    outline:
      'border-2 border-Teal text-Teal hover:bg-Teal hover:text-white hover:border-DarkTeal hover:shadow-md focus:ring-Teal transition-all duration-300 before:absolute before:inset-0 before:bg-Teal before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100',
    ghost:
      'text-Teal hover:bg-Teal/10 hover:shadow-sm focus:ring-Teal before:absolute before:inset-0 before:bg-gradient-to-r before:from-Teal/5 before:to-Teal/15 before:scale-x-0 before:origin-center before:transition-transform before:duration-300 hover:before:scale-x-100',
  }

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  // Content wrapper to ensure text stays above pseudo-elements
  const contentWrapper = (
    <span className="relative z-10 flex items-center justify-center">{children}</span>
  )

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {contentWrapper}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button className={combinedStyles} {...props}>
      {contentWrapper}
    </button>
  )
}

export default Button
