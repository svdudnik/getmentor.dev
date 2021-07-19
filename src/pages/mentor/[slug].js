import { useEffect } from 'react'
import classNames from 'classnames'
import Head from 'next/head'
import NavHeader from '../../components/NavHeader'
import Footer from '../../components/Footer'
import { getMentors } from '../../server/cached-mentors'
import Section from '../../components/Section'
import ContactMentorModalPopup from '../../components/ContactMentorModalPopup'
import Interweave from 'interweave'
import MetaHeader from '../../components/MetaHeader'
import seo from '../../config/seo'
import allFilters from '../../config/filters'
import analytics from '../../lib/analytics'

export async function getServerSideProps(context) {
  const allMentors = await getMentors()
  const mentor = allMentors.find((mentor) => mentor.slug === context.params.slug)

  if (!mentor) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      mentor,
    },
  }
}

export default function Mentor(props) {
  const { mentor } = props

  useEffect(() => {
    analytics.event('View Mentor Page', {
      id: mentor.id,
      name: mentor.name,
      experience: mentor.experience,
      price: mentor.price,
      menteeCount: mentor.menteeCount,
    })
  }, [])

  return (
    <>
      <Head>
        <title>
          {mentor.name} | {seo.title}
        </title>

        <MetaHeader
          customTitle={mentor.name}
          customDescription={mentor.job}
          customImage={mentor.photo_url}
        />
      </Head>

      <NavHeader className="bg-primary-100" />

      <Section id="body">
        <div className="flex">
          <div className="flex-1">
            <h1 className="mb-2">{mentor.name}</h1>
            <div className="mb-3">{mentor.job}</div>

            <div className="flex flex-wrap -m-1 mb-5">
              {mentor.tags.map((tag) => (
                <div
                  key={tag}
                  // className="border-2 border-gray-700 rounded-full py-1 px-4 m-2"
                  className={classNames('text-sm text-gray-600 rounded-full py-1 px-4 m-1', {
                    'bg-gray-300': allFilters.tags.includes(tag),
                    'bg-indigo-200': allFilters.sponsors.includes(tag),
                  })}
                >
                  {tag}
                </div>
              ))}
            </div>

            <div className="mb-4 md:hidden">
              <img className="w-full" src={mentor.photo_url} />
            </div>

            {!mentor.isVisible && (
              <div className="text-gray-500 mb-6">Ментор приостановил приём заявок.</div>
            )}

            <div className="mb-4">
              <b>Опыт:</b> {mentor.experience}
              <br />
              <b>Цена:</b> {mentor.price}
              <br />
            </div>

            {mentor.isVisible && (
              <div className="mb-6">
                <ContactMentorModalPopup mentor={mentor} titleText="Оставить заявку" />
              </div>
            )}

            <div className="prose my-4">
              <Interweave noWrap={true} content={mentor.description.replace(/\n/gi, '</br/>')} />
            </div>
          </div>

          <div className="flex-1 pl-4 hidden md:block">
            <img src={mentor.photo.url} />
          </div>
        </div>
      </Section>

      <Footer />
    </>
  )
}
