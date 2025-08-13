import { Block } from 'payload'

const CrossPlatform: Block = {
  slug: 'platform',
  labels: {
    singular: 'Platform Section',
    plural: 'Platform Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      required: true,
      defaultValue: 'Available on all',
      admin: {
        description: 'First part of the heading (before animated text)',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Section Subheading',
      required: true,
      defaultValue: 'Platforms',
      admin: {
        description: 'Text that appears after the animated platform names',
      },
    },
    {
      name: 'animatedPlatforms',
      type: 'array',
      label: 'Animated Platform Names',
      required: true,
      minRows: 2,
      maxRows: 5,
      defaultValue: [{ platform: 'Web' }, { platform: 'Android' }, { platform: 'iOS' }],
      fields: [
        {
          name: 'platform',
          type: 'text',
          label: 'Platform Name',
          required: true,
          admin: {
            description: 'Platform name that will appear in animation (e.g., Web, Android, iOS)',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
      defaultValue:
        'Access your HRM System anytime, anywhere with full support on Web, Android, and iOS platforms.',
      admin: {
        description: 'Description text below the heading',
      },
    },
    {
      name: 'platformIcons',
      type: 'array',
      label: 'Platform Icons',
      required: false,
      maxRows: 5,
      defaultValue: [
        { platform: 'Chrome', iconName: 'logos:chrome' },
        { platform: 'Google Play', iconName: 'logos:google-play-icon' },
        { platform: 'App Store', iconName: 'logos:apple-app-store' },
      ],
      fields: [
        {
          name: 'platform',
          type: 'text',
          label: 'Platform Name',
          required: true,
        },
        {
          name: 'iconName',
          type: 'text',
          label: 'Icon Name',
          required: true,
          admin: {
            description: 'Iconify icon name (e.g., logos:chrome, logos:google-play-icon)',
          },
        },
      ],
    },
    {
      name: 'deviceImage',
      type: 'upload',
      label: 'Device Mockup Image',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Image showing devices (laptop and phone mockups)',
      },
    },
    {
      name: 'animationSpeed',
      type: 'number',
      label: 'Animation Speed (seconds)',
      defaultValue: 2,
      min: 1,
      max: 5,
      admin: {
        description: 'How long each platform name is displayed before switching',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      options: [
        {
          label: 'White',
          value: 'white',
        },
        {
          label: 'Light Gray',
          value: 'gray-50',
        },
        {
          label: 'Light Blue',
          value: 'blue-50',
        },
      ],
      defaultValue: 'gray-50',
    },
  ],
}

export default CrossPlatform
