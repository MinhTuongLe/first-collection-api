/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentemail, setCurrentemail] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(async () => {
    const data = await JSON.parse(localStorage.getItem("currentUser"));
    setCurrentemail(data?.email);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      <Container>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h3>snappy</h3>
        </div>
        <div className="contacts">
          {contacts
            .filter(
              (item) =>
                item.email !==
                JSON.parse(localStorage.getItem("currentUser"))?.email
            )
            .map((contact, index) => {
              return (
                <div
                  key={contact?._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={
                        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngegg.com%2Fen%2Fsearch%3Fq%3Davatars&psig=AOvVaw0gokjLhJYSDqNprqRUSX4O&ust=1722229652794000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNDbgcb7yIcDFQAAAAAdAAAAABAI"
                      }
                      alt=""
                    />
                  </div>
                  <div className="email">
                    <h3>{contact?.email}</h3>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img
              src={
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngegg.com%2Fen%2Fsearch%3Fq%3Davatars&psig=AOvVaw0gokjLhJYSDqNprqRUSX4O&ust=1722229652794000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNDbgcb7yIcDFQAAAAAdAAAAABAI"
              }
              alt=""
            />
          </div>
          <div className="email">
            <h2>{currentemail}</h2>
          </div>
        </div>
      </Container>
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .email {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .email {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .email {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
