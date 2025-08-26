import {getRequestConfig} from 'next-intl/server'

export default getRequestConfig(async ({locale}) => {
  // Fallback to 'en' if locale is missing
  const activeLocale = locale || 'en'

  try {
    const messages = (await import(`../messages/${activeLocale}.json`)).default
    return {messages, locale: activeLocale}
  } catch {
    const fallback = (await import('../messages/en.json')).default
    return {messages: fallback, locale: 'en'}
  }
})


