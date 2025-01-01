import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Details from '@/components/Details'
import Contestants from '@/components/Contestants'
import Head from 'next/head'
import ContestPoll from '@/components/ContestPoll'
import { GetServerSidePropsContext } from 'next'
import { ContestantStruct, PollStruct, RootState } from '@/utils/types'
import UpdatePoll from '@/components/UpdatePoll'
import DeletePoll from '@/components/DeletePoll'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { globalActions } from '@/store/globalSlices'
import { getContestants, getPoll } from '@/services/blockchain'

export default function Polls({
  pollData,
  contestantData,
}: {
  pollData: PollStruct
  contestantData: ContestantStruct[]
}) {
  const dispatch = useDispatch()
  const { setPoll, setContestants } = globalActions
  const { poll, contestants } = useSelector(
    (states: RootState) => states.globalStates
  )
  const router = useRouter()

  useEffect(() => {
    dispatch(setPoll(pollData))
    dispatch(setContestants(contestantData))
  }, [dispatch, setPoll, pollData, setContestants, contestantData])

  return (
    <>
      {poll && (
        <Head>
          <title>Poll | {poll.title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      )}

      <div className="min-h-screen relative backdrop-blur">
        <div
          className="absolute inset-0 before:absolute before:inset-0
          before:w-full before:h-full before:bg-[url('/assets/images/bg.jpeg')]
          before:blur-sm before:z-[-1] before:bg-no-repeat before:bg-cover"
        />

        <section className="relative px-5 py-10 space-y-16 text-white sm:p-10">
          <Navbar />
          {poll && <Details poll={poll} />}
          {poll && contestants && <Contestants poll={poll} contestants={contestants} />}
          <Footer />
        </section>

        {poll && <ContestPoll poll={poll} />}
        {poll && <DeletePoll poll={poll} />}
        {poll && <UpdatePoll pollData={poll} />}
      </div>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const pollData = await getPoll(Number(id))
  const contestantData = await getContestants(Number(id))

  return {
    props: {
      pollData: JSON.parse(JSON.stringify(pollData)),
      contestantData: JSON.parse(JSON.stringify(contestantData)),
    },
  }
}
