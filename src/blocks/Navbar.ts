import { Block } from 'payload'

const NavbarBlock: Block = {
  slug: 'navbar',
  labels: {
    singular: 'Navbar',
    plural: 'Navbars',
  },
  fields: [
    {
      name: 'logo', // Changed from 'title' to 'logo' for clarity
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

export default NavbarBlock
