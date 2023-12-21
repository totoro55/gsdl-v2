import { FC, useState } from 'react'
import { Button, Flex, Text, TextField } from '@radix-ui/themes'
import { ReloadIcon } from '@radix-ui/react-icons'

const AddTokenForm: FC = () => {
  const [token, setToken] = useState<string>('')
  const [isLoading, setIsloading] = useState<boolean>(false)
  //const [result, setResult] = useState<string>('')

  const handleCheckToken = async (): Promise<void> => {
    if (token.length<3) return
    setIsloading(true)
    await window.telegram.checkBotToken(token)
      .then(res=>{
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
      .finally(()=>setIsloading(false))
  }

  return (
    <Flex direction="row" gap="3" justify="start">
      <label className="w-full">
        <Flex direction="column" gap="3" width="100%">
          <Text size="2" mb="-1">
            Токен Telegram Bot&apos;а
          </Text>
          <Flex direction="row" width="100%" gap="3" align="center">
            <Flex direction="column" width="100%">
              <TextField.Input
                value={token}
                onChange={e => setToken(e.target.value)}
                id="tg-token"
                placeholder="Вставьте токен"
              />
            </Flex>
            <Button
              disabled={token.length < 3 || isLoading}
              onClick={handleCheckToken}
            >
              {isLoading && <div className='animate-spin text-indigo-500 dark:text-indigo-300 '><ReloadIcon /></div>}
              Проверить
            </Button>
          </Flex>
        </Flex>
      </label>
    </Flex>
  )
}

export default AddTokenForm
