import { GlobalConfig } from 'payload'

const Navbar: GlobalConfig = {
  slug: 'navbar',
  label: 'Navbar',
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo Image',
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Text',
      required: true,
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA URL',
      required: true,
    },
  ],
}

export default Navbar
