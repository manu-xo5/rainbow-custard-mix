import * as React from 'react'

type Props = {
  icon: any
  title: any
  last_note: any
  last_updated_at: any
}

export default function FolderCard({ icon, title, last_note, last_updated_at }: Props) {
  return (
    <div className="bg-primary p-4 mx-5 my-4 rounded-lg flex gap-x-4">
      <span
        className="flex items-center aspect-square"
        style={{
          fontSize: '44px',
          lineHeight: '44px',
        }}
      >
        {icon}
      </span>

      <span className="grow text-border  min-w-0 truncate">
        <span className="text-text-primary flex justify-between text-xl">
          {title}

          <span className="text-base">{last_updated_at}</span>
        </span>

        <span className="whitespace-nowrap">{last_note}</span>
      </span>
    </div>
  )
}
