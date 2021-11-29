import React from 'react'
import tw from 'twin.macro'
import { Button } from './../components'

const styles = {
  // Move long class sets out of jsx to keep it scannable
  container: ({ hasBackground }) => [
    tw`flex flex-col items-center justify-center h-screen`,
    hasBackground && tw`bg-gradient-to-b from-purple-300 to-indigo-500`,
  ],
}

const IndexPage = () => (
  <div css={styles.container({ hasBackground: true })}>
    <div tw="flex flex-col justify-center h-full gap-y-5">
      <Button variant="primary">Submit</Button>
      <Button variant="secondary">Cancel</Button>
      <Button isSmall>Close</Button>
    </div>
    <img src="/static/logo.png" alt="logo" tw="h-32 self-center object-cover absolute inset-0" />
  </div>
)

export default IndexPage
